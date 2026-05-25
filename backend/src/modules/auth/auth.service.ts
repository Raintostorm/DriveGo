import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcryptjs"
import { randomUUID } from "crypto"
import { Repository } from "typeorm"
import { FirebaseAdminService } from "../../firebase/firebase-admin.service"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { DEFAULT_LICENSE_CLASS } from "../../common/license-class.constants"
import { GoogleLoginDto, LoginDto, RegisterDto, UserRole } from "./dto/auth.dto"
import { JwtPayload } from "./jwt.strategy"

export type AuthResponseUser = {
  id: string
  email: string
  role: string
  fullName: string | null
}

export type AuthResponse = {
  accessToken: string
  user: AuthResponseUser
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly profilesRepo: Repository<StudentProfile>,
    private readonly jwtService: JwtService,
    private readonly firebaseAdmin: FirebaseAdminService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (existing) {
      throw new ConflictException("Email đã được sử dụng")
    }

    const role = dto.role ?? UserRole.STUDENT
    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      role,
    })
    await this.usersRepo.save(user)

    if (role === UserRole.STUDENT) {
      const profile = this.profilesRepo.create({
        userId: user.id,
        fullName: dto.fullName ?? null,
        phone: dto.phone ?? null,
        licenseClass: dto.licenseClass ?? DEFAULT_LICENSE_CLASS,
        heldLicenses: [],
      })
      await this.profilesRepo.save(profile)
      user.profile = profile
    }

    return this.buildAuthResponse(user)
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
      relations: { profile: true },
    })

    if (!user) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng")
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng")
    }

    return this.buildAuthResponse(user)
  }

  async loginWithGoogle(dto: GoogleLoginDto): Promise<AuthResponse> {
    if (!this.firebaseAdmin.isConfigured()) {
      throw new ServiceUnavailableException(
        "Google Sign-in chưa cấu hình trên server (FIREBASE_PROJECT_ID / GOOGLE_APPLICATION_CREDENTIALS)",
      )
    }

    let decoded: Awaited<ReturnType<FirebaseAdminService["verifyIdToken"]>>
    try {
      decoded = await this.firebaseAdmin.verifyIdToken(dto.idToken)
    } catch {
      throw new UnauthorizedException("Token Google không hợp lệ hoặc đã hết hạn")
    }

    const email = decoded.email
    if (!email) {
      throw new UnauthorizedException("Tài khoản Google không có email")
    }

    const fullName = decoded.name ?? null

    let user = await this.usersRepo.findOne({
      where: { email },
      relations: { profile: true },
    })

    if (!user) {
      const passwordHash = await bcrypt.hash(randomUUID(), 10)
      user = this.usersRepo.create({
        email,
        passwordHash,
        role: UserRole.STUDENT,
      })
      await this.usersRepo.save(user)

      const profile = this.profilesRepo.create({
        userId: user.id,
        fullName,
        phone: null,
        licenseClass: DEFAULT_LICENSE_CLASS,
        heldLicenses: [],
      })
      await this.profilesRepo.save(profile)
      user.profile = profile
    } else if (fullName && user.profile && !user.profile.fullName) {
      user.profile.fullName = fullName
      await this.profilesRepo.save(user.profile)
    } else if (fullName && !user.profile) {
      const profile = this.profilesRepo.create({
        userId: user.id,
        fullName,
        phone: null,
        licenseClass: DEFAULT_LICENSE_CLASS,
        heldLicenses: [],
      })
      await this.profilesRepo.save(profile)
      user.profile = profile
    }

    return this.buildAuthResponse(user)
  }

  private buildAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.profile?.fullName ?? null,
      },
    }
  }
}
