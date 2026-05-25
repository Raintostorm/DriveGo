import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import * as bcrypt from "bcryptjs"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createCenterAdmin(dto: {
    email: string
    password: string
    centerId: string
    fullName?: string
  }) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } })
    if (exists) throw new BadRequestException("Email đã tồn tại")

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      role: "center_admin",
      centerId: dto.centerId,
    })
    await this.usersRepo.save(user)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      centerId: user.centerId,
      fullName: dto.fullName ?? null,
    }
  }
}
