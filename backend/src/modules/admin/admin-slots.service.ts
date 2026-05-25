import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ScheduleSlot } from "../../entities/schedule-slot.entity"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminScopeService } from "./admin-scope.service"

@Injectable()
export class AdminSlotsService {
  constructor(
    @InjectRepository(ScheduleSlot)
    private readonly slotsRepo: Repository<ScheduleSlot>,
    private readonly scope: AdminScopeService,
  ) {}

  private async resolveCenterId(admin: AuthUser, dtoCenterId?: string | null) {
    const scoped = await this.scope.getCenterIdForAdmin(admin)
    if (scoped) return scoped
    return dtoCenterId ?? null
  }

  async list(admin: AuthUser, slotType?: string) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.slotsRepo.createQueryBuilder("s").orderBy("s.slot_date", "ASC")
    if (centerId) qb.andWhere("s.center_id = :centerId", { centerId })
    if (slotType) qb.andWhere("s.slot_type = :slotType", { slotType })
    return qb.getMany()
  }

  async create(
    admin: AuthUser,
    dto: {
      centerId?: string
      slotDate: string
      startTime: string
      endTime: string
      venue?: string
      licenseClass?: string
      slotType?: string
      capacity?: number
    },
  ) {
    const centerId = await this.resolveCenterId(admin, dto.centerId)
    if (admin.role === "center_admin" && !centerId) {
      throw new ForbiddenException("Tài khoản chưa gắn trung tâm")
    }
    const slot = this.slotsRepo.create({
      centerId,
      slotDate: dto.slotDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      venue: dto.venue ?? null,
      licenseClass: dto.licenseClass ?? null,
      slotType: dto.slotType ?? "theory_exam",
      capacity: dto.capacity ?? 20,
      registeredCount: 0,
      createdBy: admin.userId,
    })
    return this.slotsRepo.save(slot)
  }

  async update(admin: AuthUser, id: string, dto: Partial<ScheduleSlot>) {
    const slot = await this.slotsRepo.findOne({ where: { id } })
    if (!slot) throw new NotFoundException("Không tìm thấy ca")
    await this.scope.assertCenterAccessAsync(admin, slot.centerId)
    Object.assign(slot, {
      slotDate: dto.slotDate ?? slot.slotDate,
      startTime: dto.startTime ?? slot.startTime,
      endTime: dto.endTime ?? slot.endTime,
      venue: dto.venue !== undefined ? dto.venue : slot.venue,
      licenseClass: dto.licenseClass !== undefined ? dto.licenseClass : slot.licenseClass,
      slotType: dto.slotType ?? slot.slotType,
      capacity: dto.capacity ?? slot.capacity,
    })
    return this.slotsRepo.save(slot)
  }

  async remove(admin: AuthUser, id: string) {
    const slot = await this.slotsRepo.findOne({ where: { id } })
    if (!slot) throw new NotFoundException("Không tìm thấy ca")
    await this.scope.assertCenterAccessAsync(admin, slot.centerId)
    await this.slotsRepo.remove(slot)
    return { ok: true }
  }
}
