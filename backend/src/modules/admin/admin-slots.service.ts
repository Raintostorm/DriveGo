import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { ExamRegistration, ScheduleSlot, TrainingCenter } from "../../entities/schedule-slot.entity"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminScopeService } from "./admin-scope.service"

@Injectable()
export class AdminSlotsService {
  constructor(
    @InjectRepository(ScheduleSlot)
    private readonly slotsRepo: Repository<ScheduleSlot>,
    @InjectRepository(ExamRegistration)
    private readonly registrationsRepo: Repository<ExamRegistration>,
    @InjectRepository(TrainingCenter)
    private readonly centersRepo: Repository<TrainingCenter>,
    private readonly scope: AdminScopeService,
  ) {}

  private async resolveCenterId(admin: AuthUser, dtoCenterId?: string | null) {
    const scoped = await this.scope.getCenterIdForAdmin(admin)
    if (scoped) return scoped
    if (admin.role === "system_admin") {
      if (!dtoCenterId) {
        throw new BadRequestException("System admin cần chọn centerId khi tạo ca thi")
      }
      return dtoCenterId
    }
    return dtoCenterId ?? null
  }

  async list(admin: AuthUser, slotType?: string) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.slotsRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.center", "center")
      .orderBy("s.slot_date", "ASC")
    if (centerId) qb.andWhere("s.center_id = :centerId", { centerId })
    if (slotType) qb.andWhere("s.slot_type = :slotType", { slotType })
    const slots = await qb.getMany()
    const slotIds = slots.map((s) => s.id)
    const heldRows =
      slotIds.length > 0
        ? await this.registrationsRepo
            .createQueryBuilder("r")
            .select("r.slot_id", "slotId")
            .addSelect("COUNT(*)", "cnt")
            .where("r.slot_id IN (:...slotIds)", { slotIds })
            .andWhere("r.status IN (:...statuses)", {
              statuses: ["pending", "confirmed"],
            })
            .groupBy("r.slot_id")
            .getRawMany<{ slotId: string; cnt: string }>()
        : []
    const heldBySlot = new Map(heldRows.map((r) => [r.slotId, Number(r.cnt)]))

    return slots.map((s) => {
      const heldSeats = heldBySlot.get(s.id) ?? 0
      return {
        id: s.id,
        slotType: s.slotType,
        date: s.slotDate,
        slotDate: s.slotDate,
        startTime: s.startTime,
        endTime: s.endTime,
        venue: s.venue,
        licenseClass: s.licenseClass,
        capacity: s.capacity,
        registeredCount: s.registeredCount,
        heldSeats,
        remaining: Math.max(0, s.capacity - heldSeats),
        centerName: s.center?.name,
      }
    })
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
    const center = await this.centersRepo.findOne({ where: { id: centerId! } })
    if (!center) throw new NotFoundException("Không tìm thấy trung tâm")

    const slot = this.slotsRepo.create({
      centerId: centerId!,
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
