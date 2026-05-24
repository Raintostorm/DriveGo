import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Notification } from "../../entities/notification.entity"

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async list(userId: string, filter?: string) {
    const qb = this.repo
      .createQueryBuilder("n")
      .where("n.user_id = :userId", { userId })
      .orderBy("n.created_at", "DESC")

    if (filter === "unread") {
      qb.andWhere("n.read_at IS NULL")
    }

    const rows = await qb.getMany()
    return rows.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: Boolean(n.readAt),
      actionUrl: n.actionUrl,
      createdAt: n.createdAt,
    }))
  }

  async markRead(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, userId } })
    if (!row) throw new NotFoundException("Không tìm thấy thông báo")
    row.readAt = new Date()
    await this.repo.save(row)
    return { id: row.id, read: true }
  }
}
