import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { Roles } from "../../common/decorators/roles.decorator"
import { CurrentUser } from "../../common/current-user.decorator"
import { RolesGuard } from "../../common/guards/roles.guard"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { AdminSchedulesService } from "./admin-schedules.service"
import { CreateSlotAdminDto } from "./dto/create-slot-admin.dto"
import { PatchRegistrationAdminDto } from "./dto/patch-registration-admin.dto"

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("center_admin", "system_admin")
export class AdminSchedulesController {
  constructor(private readonly service: AdminSchedulesService) {}

  @Get("registrations")
  listRegistrations(
    @CurrentUser() user: AuthUser,
    @Query("status") status?: string,
    @Query("slotType") slotType?: string,
  ) {
    return this.service.listRegistrations(user, status, slotType)
  }

  @Patch("registrations/:id")
  patchRegistration(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: PatchRegistrationAdminDto,
  ) {
    return this.service.patchRegistration(user, id, body)
  }

  @Get("slots")
  listSlots(
    @CurrentUser() user: AuthUser,
    @Query("slotType") slotType?: string,
    @Query("date") date?: string,
  ) {
    return this.service.listSlots(user, slotType, date)
  }

  @Post("slots")
  createSlot(@CurrentUser() user: AuthUser, @Body() body: CreateSlotAdminDto) {
    return this.service.createSlot(user, body)
  }
}
