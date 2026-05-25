import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { ExamRegistration, ScheduleSlot } from "../../entities/schedule-slot.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { AuthUser } from "../auth/jwt.strategy"
import { NotificationsService } from "../notifications/notifications.service"
import { AdminScopeService } from "./admin-scope.service"
import { CreateSlotAdminDto } from "./dto/create-slot-admin.dto"
import { PatchRegistrationAdminDto } from "./dto/patch-registration-admin.dto"

@Injectable()
export class AdminSchedulesService {
  constructor(
    @InjectRepository(ScheduleSlot)
    private readonly slotsRepo: Repository<ScheduleSlot>,
    @InjectRepository(ExamRegistration)
    private readonly registrationsRepo: Repository<ExamRegistration>,
    @InjectRepository(StudentProfile)
    private readonly profilesRepo: Repository<StudentProfile>,
    private readonly scope: AdminScopeService,
    private readonly notifications: NotificationsService,
  ) {}

  async listRegistrations(
    admin: AuthUser,
    status?: string,
    slotType?: string,
  ) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.registrationsRepo
      .createQueryBuilder("r")
      .leftJoinAndSelect("r.slot", "s")
      .leftJoinAndSelect("r.user", "u")
      .orderBy("s.slot_date", "ASC")
      .addOrderBy("s.start_time", "ASC")

    qb.andWhere("r.status = :status", { status: status ?? "pending" })
    if (slotType) qb.andWhere("s.slot_type = :slotType", { slotType })
    if (centerId) qb.andWhere("s.center_id = :centerId", { centerId })

    const rows = await qb.getMany()
    const userIds = [...new Set(rows.map((r) => r.userId))]
    const profiles =
      userIds.length > 0
        ? await this.profilesRepo.find({ where: { userId: In(userIds) } })
        : []
    const nameByUser = new Map(profiles.map((p) => [p.userId, p.fullName]))

    return rows.map((r) => ({
      id: r.id,
      status: r.status,
      adminNote: r.adminNote,
      userId: r.userId,
      studentEmail: r.user?.email,
      studentName: nameByUser.get(r.userId) ?? r.user?.email,
      slot: r.slot
        ? {
            id: r.slot.id,
            date: r.slot.slotDate,
            startTime: r.slot.startTime,
            endTime: r.slot.endTime,
            venue: r.slot.venue,
            slotType: r.slot.slotType,
            licenseClass: r.slot.licenseClass,
          }
        : null,
    }))
  }

  async patchRegistration(
    admin: AuthUser,
    id: string,
    dto: PatchRegistrationAdminDto,
  ) {
    const reg = await this.registrationsRepo.findOne({
      where: { id },
      relations: { slot: true },
    })
    if (!reg) throw new NotFoundException("Không tìm thấy đăng ký")
    await this.scope.assertCenterAccessAsync(admin, reg.slot?.centerId)

    if (reg.status !== "pending") {
      throw new BadRequestException("Chỉ xử lý đăng ký đang chờ duyệt")
    }

    const slot = reg.slot ?? (await this.slotsRepo.findOne({ where: { id: reg.slotId } }))
    if (!slot) throw new NotFoundException("Không tìm thấy ca")

    if (dto.status === "confirmed") {
      if (slot.registeredCount >= slot.capacity) {
        throw new ConflictException("Ca thi đã đầy")
      }
      reg.status = "confirmed"
      slot.registeredCount += 1
      await this.slotsRepo.save(slot)
      await this.notifications.createForUser(reg.userId, {
        type: "schedule_confirmed",
        title: "Đăng ký ca thi đã được xác nhận",
        body: dto.adminNote ?? `Ca ${slot.slotDate} ${String(slot.startTime).slice(0, 5)}`,
        actionUrl: "/schedule",
      })
    } else {
      reg.status = "rejected"
      await this.notifications.createForUser(reg.userId, {
        type: "schedule_rejected",
        title: "Đăng ký ca thi bị từ chối",
        body: dto.adminNote ?? "Vui lòng chọn ca khác hoặc liên hệ trung tâm",
        actionUrl: "/schedule",
      })
    }

    reg.adminNote = dto.adminNote ?? reg.adminNote
    reg.reviewedAt = new Date()
    reg.reviewedBy = admin.userId
    await this.registrationsRepo.save(reg)

    return { id: reg.id, status: reg.status }
  }

  async listSlots(admin: AuthUser, slotType?: string, date?: string) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.slotsRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.center", "center")
      .orderBy("s.slot_date", "ASC")
      .addOrderBy("s.start_time", "ASC")

    if (slotType) qb.andWhere("s.slot_type = :slotType", { slotType })
    if (date) qb.andWhere("s.slot_date = :date", { date })
    if (centerId) qb.andWhere("s.center_id = :centerId", { centerId })

    const slots = await qb.getMany()
    return slots.map((s) => ({
      id: s.id,
      slotType: s.slotType,
      date: s.slotDate,
      startTime: s.startTime,
      endTime: s.endTime,
      venue: s.venue,
      licenseClass: s.licenseClass,
      capacity: s.capacity,
      registeredCount: s.registeredCount,
      centerName: s.center?.name,
    }))
  }

  async createSlot(admin: AuthUser, dto: CreateSlotAdminDto) {
    let centerId = await this.scope.getCenterIdForAdmin(admin)
    if (admin.role === "system_admin" && !centerId) {
      centerId = null
    }
    const slot = this.slotsRepo.create({
      centerId: centerId ?? undefined,
      slotDate: dto.slotDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
      venue: dto.venue,
      licenseClass: dto.licenseClass,
      slotType: dto.slotType,
      capacity: dto.capacity,
      registeredCount: 0,
    })
    await this.slotsRepo.save(slot)
    return { id: slot.id }
  }

  async countPendingRegistrations(admin: AuthUser) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.registrationsRepo
      .createQueryBuilder("r")
      .innerJoin("r.slot", "s")
      .where("r.status = :status", { status: "pending" })
    if (centerId) qb.andWhere("s.center_id = :centerId", { centerId })
    return qb.getCount()
  }
}
