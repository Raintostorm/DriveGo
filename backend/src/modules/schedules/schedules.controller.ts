import { Controller, Get, Post } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("schedules")
export class SchedulesController {
  @Get()
  list() {
    dbNotConfigured("schedules.list")
  }

  @Post("registrations")
  register() {
    dbNotConfigured("schedules.register")
  }
}
