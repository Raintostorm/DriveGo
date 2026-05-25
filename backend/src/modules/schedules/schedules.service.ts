import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { ApplicationsService } from "../applications/applications.service"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ExamRegistration, ScheduleSlot } from "../../entities/schedule-slot.entity"

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ScheduleSlot)
    private readonly slotsRepo: Repository<ScheduleSlot>,
    @InjectRepository(ExamRegistration)
    private readonly registrationsRepo: Repository<ExamRegistration>,
    private readonly applications: ApplicationsService,
  ) {}

  async listSlots(licenseClass?: string, date?: string, slotType?: string) {
    const qb = this.slotsRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.center", "center")
      .orderBy("s.slot_date", "ASC")
      .addOrderBy("s.start_time", "ASC")

    if (licenseClass) {
      qb.andWhere("s.license_class = :licenseClass", { licenseClass })
    }
    if (date) {
      qb.andWhere("s.slot_date = :date", { date })
    }
    if (slotType) {
      qb.andWhere("s.slot_type = :slotType", { slotType })
    } else {
      qb.andWhere("s.slot_type = :defaultType", { defaultType: "theory_exam" })
    }

    const slots = await qb.getMany()
    return slots.map((s) => {
      const remaining = Math.max(0, s.capacity - s.registeredCount)
      const full = remaining === 0
      return {
        id: s.id,
        slotType: s.slotType,
        date: s.slotDate,
        startTime: s.startTime,
        endTime: s.endTime,
        timeLabel: `${String(s.startTime).slice(0, 5)} - ${String(s.endTime).slice(0, 5)}`,
        venue: s.venue,
        centerName: s.center?.name,
        licenseClass: s.licenseClass,
        capacity: s.capacity,
        registeredCount: s.registeredCount,
        remaining,
        full,
        seatsLabel: full ? "Đã đầy suất đăng ký" : `${remaining}/${s.capacity}`,
      }
    })
  }

  async listMyRegistrations(userId: string) {
    const rows = await this.registrationsRepo.find({
      where: { userId },
      relations: { slot: true },
      order: { id: "DESC" },
    })
    return rows.map((r) => ({
      id: r.id,
      status: r.status,
      slotId: r.slotId,
      slot: r.slot
        ? {
            date: r.slot.slotDate,
            startTime: r.slot.startTime,
            endTime: r.slot.endTime,
            venue: r.slot.venue,
            slotType: r.slot.slotType,
          }
        : null,
    }))
  }

  async register(userId: string, slotId: string) {
    await this.applications.assertApprovedForExam(userId)

    const slot = await this.slotsRepo.findOne({ where: { id: slotId } })
    if (!slot) throw new NotFoundException("Không tìm thấy ca thi")

    if (slot.registeredCount >= slot.capacity) {
      throw new ConflictException("Ca thi đã đầy")
    }

    const existing = await this.registrationsRepo.findOne({
      where: { userId, slotId },
    })
    if (existing) {
      throw new ConflictException("Bạn đã đăng ký ca thi này")
    }

    const pendingOnSlot = await this.registrationsRepo.count({
      where: { userId, slotId, status: "pending" },
    })
    if (pendingOnSlot > 0) {
      throw new ConflictException("Bạn đã gửi yêu cầu cho ca này")
    }

    const reg = this.registrationsRepo.create({
      userId,
      slotId,
      status: "pending",
    })
    await this.registrationsRepo.save(reg)

    return {
      registrationId: reg.id,
      slotId,
      status: "pending",
      message: "Đã gửi yêu cầu, chờ trung tâm xác nhận",
    }
  }
}
