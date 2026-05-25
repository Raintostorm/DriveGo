import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { SessionsService } from "./sessions.service"

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly service: SessionsService) {}

  @Get("upcoming")
  upcoming(@Req() req: { user: { userId: string } }) {
    return this.service.upcomingForUser(req.user.userId)
  }

  @Post(":id/check-in")
  checkIn(@Req() req: { user: { userId: string } }, @Param("id") id: string) {
    return this.service.checkIn(req.user.userId, id)
  }
}
