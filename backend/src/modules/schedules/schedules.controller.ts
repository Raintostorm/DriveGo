import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { SchedulesService } from "./schedules.service"

@Controller("schedules")
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  list(@Query("licenseClass") licenseClass?: string, @Query("date") date?: string) {
    return this.service.listSlots(licenseClass, date)
  }

  @Post("registrations")
  @UseGuards(JwtAuthGuard)
  register(@CurrentUser() user: AuthUser, @Body() body: { slotId: string }) {
    return this.service.register(user.userId, body.slotId)
  }
}
