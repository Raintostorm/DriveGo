import { In, Repository } from "typeorm"
import { ExamRegistration } from "../entities/schedule-slot.entity"

export const HELD_REGISTRATION_STATUSES = ["pending", "confirmed"] as const

export async function countHeldSeats(
  repo: Repository<ExamRegistration>,
  slotId: string,
): Promise<number> {
  return repo.count({
    where: { slotId, status: In([...HELD_REGISTRATION_STATUSES]) },
  })
}

export async function countHeldSeatsBySlotIds(
  repo: Repository<ExamRegistration>,
  slotIds: string[],
): Promise<Map<string, number>> {
  if (slotIds.length === 0) return new Map()

  const rows = await repo
    .createQueryBuilder("r")
    .select("r.slot_id", "slotId")
    .addSelect("COUNT(*)", "cnt")
    .where("r.slot_id IN (:...slotIds)", { slotIds })
    .andWhere("r.status IN (:...statuses)", {
      statuses: [...HELD_REGISTRATION_STATUSES],
    })
    .groupBy("r.slot_id")
    .getRawMany<{ slotId: string; cnt: string }>()

  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.slotId, Number(row.cnt))
  }
  return map
}

export function slotSeatMetrics(capacity: number, confirmedCount: number, heldCount: number) {
  const remaining = Math.max(0, capacity - heldCount)
  const full = heldCount >= capacity
  return {
    capacity,
    registeredCount: confirmedCount,
    heldCount,
    remaining,
    full,
    seatsLabel: full ? "Đã đầy suất đăng ký" : `${remaining}/${capacity}`,
  }
}
