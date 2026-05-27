import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { SchedulesService } from "./schedules.service"

@Controller("schedules")
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  list(
    @Query("licenseClass") licenseClass?: string,
    @Query("date") date?: string,
    @Query("slotType") slotType?: string,
    @Req() req?: { user?: AuthUser | null },
  ) {
    const userId = req?.user?.userId
    return this.service.listSlots(licenseClass, date, slotType, userId)
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
