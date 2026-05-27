import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminUsersService } from "./admin-users.service"
import { CreateCenterAdminUserDto } from "./dto/create-center-admin-user.dto"

@Controller("admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("system_admin")
export class AdminUsersController {
  constructor(private readonly service: AdminUsersService) {}

  @Post("center-admin")
  createCenterAdmin(@Body() body: CreateCenterAdminUserDto) {
    return this.service.createCenterAdmin(body)
  }
}
