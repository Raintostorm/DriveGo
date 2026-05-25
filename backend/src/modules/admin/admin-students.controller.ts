import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminStudentsService } from "./admin-students.service"

@Controller("admin/students")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("center_admin", "system_admin")
export class AdminStudentsController {
  constructor(private readonly service: AdminStudentsService) {}

  @Get()
  list(
    @Query("premium") premium?: string,
    @Query("enrolled") enrolled?: string,
    @Query("licenseClass") licenseClass?: string,
  ) {
    return this.service.list({ premium, enrolled, licenseClass })
  }
}
