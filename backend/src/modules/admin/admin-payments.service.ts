import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Payment } from "../../entities/payment.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminScopeService } from "./admin-scope.service"

@Injectable()
export class AdminPaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
    private readonly scope: AdminScopeService,
  ) {}

  async list(admin: AuthUser, filters: { status?: string; paymentType?: string }) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.paymentsRepo
      .createQueryBuilder("pay")
      .innerJoin(User, "u", "u.id = pay.user_id")
      .leftJoin(StudentProfile, "p", "p.user_id = pay.user_id")
      .orderBy("pay.created_at", "DESC")

    if (centerId) {
      qb.andWhere("p.center_id = :centerId", { centerId })
    }
    if (filters.status) {
      qb.andWhere("pay.status = :status", { status: filters.status })
    }
    if (filters.paymentType) {
      qb.andWhere("pay.payment_type = :paymentType", {
        paymentType: filters.paymentType,
      })
    }

    const rows = await qb
      .select([
        "pay.id AS id",
        "pay.user_id AS user_id",
        "pay.payment_type AS payment_type",
        "pay.license_class AS license_class",
        "pay.amount AS amount",
        "pay.status AS status",
        "pay.payment_code AS payment_code",
        "pay.created_at AS created_at",
        "u.email AS email",
        "p.full_name AS full_name",
      ])
      .limit(100)
      .getRawMany()

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      paymentType: r.payment_type,
      licenseClass: r.license_class,
      amount: r.amount,
      status: r.status,
      paymentCode: r.payment_code,
      createdAt: r.created_at,
      studentEmail: r.email,
      studentName: r.full_name,
    }))
  }
}
