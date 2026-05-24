import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { NotificationsService } from "./notifications.service"

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@CurrentUser() user: AuthUser, @Query("filter") filter?: string) {
    return this.service.list(user.userId, filter)
  }

  @Patch(":id/read")
  @UseGuards(JwtAuthGuard)
  markRead(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.markRead(user.userId, id)
  }
}
