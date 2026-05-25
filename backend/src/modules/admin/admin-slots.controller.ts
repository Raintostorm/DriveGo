import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AuthUser } from "../auth/jwt.strategy"
import { AdminSlotsService } from "./admin-slots.service"

@Controller("admin/schedule-slots")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("center_admin", "system_admin")
export class AdminSlotsController {
  constructor(private readonly service: AdminSlotsService) {}

  @Get()
  list(@Req() req: { user: AuthUser }, @Query("slotType") slotType?: string) {
    return this.service.list(req.user, slotType)
  }

  @Post()
  create(@Req() req: { user: AuthUser }, @Body() body: Record<string, unknown>) {
    return this.service.create(req.user, body as Parameters<AdminSlotsService["create"]>[1])
  }

  @Patch(":id")
  update(
    @Req() req: { user: AuthUser },
    @Param("id") id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.service.update(req.user, id, body as never)
  }

  @Delete(":id")
  remove(@Req() req: { user: AuthUser }, @Param("id") id: string) {
    return this.service.remove(req.user, id)
  }
}
