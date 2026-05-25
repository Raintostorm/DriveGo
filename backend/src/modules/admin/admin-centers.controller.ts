import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminCentersService } from "./admin-centers.service"

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
  create(@Body() body: { name: string; taxCode?: string; city?: string; address?: string }) {
    return this.service.create(body)
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: Record<string, string>) {
    return this.service.update(id, body)
  }
}
