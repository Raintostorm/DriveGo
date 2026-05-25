import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CourseEnrollment } from "../../entities/course-enrollment.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"

@Injectable()
export class AdminStudentsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(StudentProfile)
    private readonly profilesRepo: Repository<StudentProfile>,
    @InjectRepository(CourseEnrollment)
    private readonly enrollmentsRepo: Repository<CourseEnrollment>,
  ) {}

  async list(filters: {
    premium?: string
    enrolled?: string
    licenseClass?: string
  }) {
    const qb = this.usersRepo
      .createQueryBuilder("u")
      .innerJoin(StudentProfile, "p", "p.user_id = u.id")
      .where("u.role = :role", { role: "student" })
      .orderBy("u.email", "ASC")

    if (filters.premium === "true") {
      qb.andWhere("p.premium_until > NOW()")
    } else if (filters.premium === "false") {
      qb.andWhere("(p.premium_until IS NULL OR p.premium_until <= NOW())")
    }

    const users = await qb
      .select([
        "u.id AS id",
        "u.email AS email",
        "p.full_name AS full_name",
        "p.premium_until AS premium_until",
        "p.license_class AS license_class",
      ])
      .getRawMany<{
        id: string
        email: string
        full_name: string | null
        premium_until: Date | null
        license_class: string | null
      }>()

    const userIds = users.map((u) => u.id)
    let enrollments: CourseEnrollment[] = []
    if (userIds.length > 0) {
      const eq = this.enrollmentsRepo
        .createQueryBuilder("e")
        .where("e.user_id IN (:...userIds)", { userIds })
        .andWhere("e.status = :status", { status: "active" })
      if (filters.licenseClass) {
        eq.andWhere("e.license_class = :licenseClass", {
          licenseClass: filters.licenseClass,
        })
      }
      enrollments = await eq.getMany()
    }

    const enrollmentsByUser = new Map<string, CourseEnrollment[]>()
    for (const e of enrollments) {
      const list = enrollmentsByUser.get(e.userId) ?? []
      list.push(e)
      enrollmentsByUser.set(e.userId, list)
    }

    let rows = users.map((u) => {
      const activeEnrollments = enrollmentsByUser.get(u.id) ?? []
      return {
        userId: u.id,
        email: u.email,
        fullName: u.full_name,
        licenseClass: u.license_class,
        premiumUntil: u.premium_until,
        isPremium: Boolean(u.premium_until && new Date(u.premium_until) > new Date()),
        enrollments: activeEnrollments.map((e) => ({
          licenseClass: e.licenseClass,
          enrolledAt: e.enrolledAt,
        })),
        isEnrolled: activeEnrollments.length > 0,
      }
    })

    if (filters.enrolled === "true") {
      rows = rows.filter((r) => r.isEnrolled)
    } else if (filters.enrolled === "false") {
      rows = rows.filter((r) => !r.isEnrolled)
    }

    return rows
  }
}
