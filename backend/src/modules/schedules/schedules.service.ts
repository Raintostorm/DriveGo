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

  async listSlots(licenseClass?: string, date?: string) {
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

    const slots = await qb.getMany()
    return slots.map((s) => {
      const remaining = Math.max(0, s.capacity - s.registeredCount)
      const full = remaining === 0
      return {
        id: s.id,
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

  async register(userId: string, slotId: string) {
    await this.applications.assertSubmittedForExam(userId)

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

    const reg = this.registrationsRepo.create({
      userId,
      slotId,
      status: "confirmed",
    })
    await this.registrationsRepo.save(reg)

    slot.registeredCount += 1
    await this.slotsRepo.save(slot)

    return { registrationId: reg.id, slotId, status: "confirmed" }
  }
}
