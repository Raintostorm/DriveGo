import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CourseEnrollment } from "../../entities/course-enrollment.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminScopeService } from "./admin-scope.service"

@Injectable()
export class AdminEnrollmentsService {
  constructor(
    @InjectRepository(CourseEnrollment)
    private readonly enrollmentsRepo: Repository<CourseEnrollment>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly scope: AdminScopeService,
  ) {}

  async list(
    admin: AuthUser,
    filters: { status?: string; licenseClass?: string },
  ) {
    const centerId = await this.scope.getCenterIdForAdmin(admin)
    const qb = this.enrollmentsRepo
      .createQueryBuilder("e")
      .innerJoin(User, "u", "u.id = e.user_id")
      .leftJoin(StudentProfile, "p", "p.user_id = e.user_id")
      .orderBy("e.enrolled_at", "DESC", "NULLS LAST")

    if (centerId) {
      qb.andWhere("p.center_id = :centerId", { centerId })
    }
    if (filters.status) {
      qb.andWhere("e.status = :status", { status: filters.status })
    }
    if (filters.licenseClass) {
      qb.andWhere("e.license_class = :licenseClass", {
        licenseClass: filters.licenseClass,
      })
    }

    const rows = await qb
      .select([
        "e.id AS id",
        "e.user_id AS user_id",
        "e.license_class AS license_class",
        "e.status AS status",
        "e.enrolled_at AS enrolled_at",
        "u.email AS email",
        "p.full_name AS full_name",
      ])
      .getRawMany()

    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      licenseClass: r.license_class,
      status: r.status,
      enrolledAt: r.enrolled_at,
      studentEmail: r.email,
      studentName: r.full_name,
    }))
  }
}
