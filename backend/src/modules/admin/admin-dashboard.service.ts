import { Injectable } from "@nestjs/common"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminApplicationsService } from "./admin-applications.service"
import { AdminSchedulesService } from "./admin-schedules.service"

@Injectable()
export class AdminDashboardService {
  constructor(
    private readonly applications: AdminApplicationsService,
    private readonly schedules: AdminSchedulesService,
  ) {}

  async getSummary(admin: AuthUser) {
    const [submittedApplications, pendingRegistrations] = await Promise.all([
      this.applications.countByStatus(admin, "submitted"),
      this.schedules.countPendingRegistrations(admin),
    ])
    return {
      submittedApplications,
      pendingRegistrations,
    }
  }
}
