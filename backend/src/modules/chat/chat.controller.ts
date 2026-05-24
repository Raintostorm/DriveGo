import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("chat")
export class ChatController {
  @Post("sessions")
  createSession() {
    dbNotConfigured("chat.createSession")
  }

  @Get("sessions")
  listSessions() {
    dbNotConfigured("chat.listSessions")
  }

  @Post("sessions/:id/messages")
  sendMessage(@Param("id") _id: string, @Body() _body: unknown) {
    dbNotConfigured("chat.sendMessage")
  }
}
