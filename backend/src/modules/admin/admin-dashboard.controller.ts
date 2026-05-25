import { Controller, Get, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { CurrentUser } from "../../common/current-user.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminDashboardService } from "./admin-dashboard.service"

@Controller("admin/dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("center_admin", "system_admin")
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  @Get("summary")
  summary(@CurrentUser() user: AuthUser) {
    return this.service.getSummary(user)
  }
}
