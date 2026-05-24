import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { ChatService } from "./chat.service"

@Controller("chat")
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post("sessions")
  @UseGuards(JwtAuthGuard)
  createSession(@CurrentUser() user: AuthUser, @Body() body: { title?: string }) {
    return this.service.createSession(user.userId, body.title)
  }

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  listSessions(@CurrentUser() user: AuthUser) {
    return this.service.listSessions(user.userId)
  }

  @Get("sessions/:id")
  @UseGuards(JwtAuthGuard)
  getSession(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.getSession(user.userId, id)
  }

  @Post("sessions/:id/messages")
  @UseGuards(JwtAuthGuard)
  sendMessage(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: { content: string },
  ) {
    return this.service.sendMessage(user.userId, id, body.content ?? "")
  }
}
