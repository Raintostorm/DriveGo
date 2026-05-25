import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminUsersService } from "./admin-users.service"

@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("system_admin")
export class AdminUsersController {
  constructor(private readonly service: AdminUsersService) {}

  @Post("center-admin")
  createCenterAdmin(
    @Body()
    body: {
      email: string
      password: string
      centerId: string
      fullName?: string
    },
  ) {
    return this.service.createCenterAdmin(body)
  }
}
