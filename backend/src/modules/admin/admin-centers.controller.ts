import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminCentersService } from "./admin-centers.service"
import { CreateCenterAdminDto } from "./dto/create-center-admin.dto"
import { UpdateCenterAdminDto } from "./dto/update-center-admin.dto"

@Controller("admin/centers")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("system_admin")
export class AdminCentersController {
  constructor(private readonly service: AdminCentersService) {}

  @Get()
  list() {
    return this.service.list()
  }

  @Post()
  create(@Body() body: CreateCenterAdminDto) {
    return this.service.create(body)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateCenterAdminDto) {
    return this.service.update(id, body)
  }
}
