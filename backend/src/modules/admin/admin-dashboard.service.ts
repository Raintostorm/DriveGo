import { Injectable } from "@nestjs/common"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminApplicationsService } from "./admin-applications.service"
import { AdminClassSessionsService } from "./admin-class-sessions.service"
import { AdminSchedulesService } from "./admin-schedules.service"

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly applications: AdminApplicationsService,
    private readonly schedules: AdminSchedulesService,
    private readonly sessions: AdminClassSessionsService,
  ) {}

  async getSummary(admin: AuthUser) {
    const [pendingApplications, draftApplications, pendingRegistrations, attendance] =
      await Promise.all([
        this.applications.countByStatus(admin, "submitted"),
        this.applications.countByStatus(admin, "draft"),
        this.schedules.countPendingRegistrations(admin),
        this.sessions.attendanceReport(admin),
      ])
    return {
      pendingApplications,
      draftApplications,
      submittedApplications: pendingApplications,
      pendingRegistrations,
      upcomingSessions: attendance.upcomingSessions,
      attendanceRate: attendance.attendanceRate,
      checkInsLast30Days: attendance.checkInsLast30Days,
    }
  }
}
