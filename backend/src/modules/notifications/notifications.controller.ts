import { Controller, Get, Patch, Param } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("notifications")
export class NotificationsController {
  @Get()
  list() {
    dbNotConfigured("notifications.list")
  }

  @Patch(":id/read")
  markRead(@Param("id") _id: string) {
    dbNotConfigured("notifications.markRead")
  }
}
