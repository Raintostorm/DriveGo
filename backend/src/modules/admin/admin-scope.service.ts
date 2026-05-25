import { ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "../../entities/user.entity"
import { AuthUser } from "../auth/jwt.strategy"

@Injectable()
export class AdminScopeService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async getCenterIdForAdmin(user: AuthUser): Promise<string | null> {
    if (user.role === "system_admin") return null
    const row = await this.usersRepo.findOne({ where: { id: user.userId } })
    return row?.centerId ?? null
  }

  async assertCenterAccessAsync(admin: AuthUser, resourceCenterId?: string | null) {
    if (admin.role === "system_admin") return
    const u = await this.usersRepo.findOne({ where: { id: admin.userId } })
    if (!u?.centerId) {
      throw new ForbiddenException("Tài khoản trung tâm chưa gắn center_id")
    }
    if (resourceCenterId && resourceCenterId !== u.centerId) {
      throw new ForbiddenException("Không thuộc trung tâm của bạn")
    }
  }
}
