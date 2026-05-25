import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminEnrollmentsService } from "./admin-enrollments.service"

@Controller("admin/enrollments")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("center_admin", "system_admin")
export class AdminEnrollmentsController {
  constructor(private readonly service: AdminEnrollmentsService) {}

  @Get()
  list(
    @Req() req: { user: AuthUser },
    @Query("status") status?: string,
    @Query("licenseClass") licenseClass?: string,
  ) {
    return this.service.list(req.user, { status, licenseClass })
  }
}
