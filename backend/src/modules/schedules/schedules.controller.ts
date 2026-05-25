import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { SchedulesService } from "./schedules.service"

@Controller("schedules")
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  list(
    @Query("licenseClass") licenseClass?: string,
    @Query("date") date?: string,
    @Query("slotType") slotType?: string,
  ) {
    return this.service.listSlots(licenseClass, date, slotType)
  }

  @Get("registrations/me")
  @UseGuards(JwtAuthGuard)
  myRegistrations(@CurrentUser() user: AuthUser) {
    return this.service.listMyRegistrations(user.userId)
  }

  @Post("registrations")
  @UseGuards(JwtAuthGuard)
  register(@CurrentUser() user: AuthUser, @Body() body: { slotId: string }) {
    return this.service.register(user.userId, body.slotId)
  }
}
