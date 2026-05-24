import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { UpdateMeDto } from "./dto/update-me.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly profilesRepo: Repository<StudentProfile>,
  ) {}

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: { profile: true },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile
        ? {
            fullName: user.profile.fullName,
            phone: user.profile.phone,
            licenseClass: user.profile.licenseClass,
            premiumUntil: user.profile.premiumUntil,
            heldLicenses: user.profile.heldLicenses ?? [],
          }
        : null,
    }
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: { profile: true },
    })
    if (!user) {
      throw new NotFoundException("User not found")
    }

    let profile = user.profile
    if (!profile) {
      profile = this.profilesRepo.create({ userId })
    }

    if (dto.fullName !== undefined) profile.fullName = dto.fullName
    if (dto.phone !== undefined) profile.phone = dto.phone
    if (dto.licenseClass !== undefined) profile.licenseClass = dto.licenseClass
    if (dto.heldLicenses !== undefined) {
      profile.heldLicenses = [...new Set(dto.heldLicenses.map((c) => c.trim()).filter(Boolean))]
    }

    await this.profilesRepo.save(profile)

    return this.getMe(userId)
  }
}
