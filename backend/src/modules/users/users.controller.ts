import { Controller, Get } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("users")
export class UsersController {
  @Get("me")
  me() {
    dbNotConfigured("users.me")
  }
}
