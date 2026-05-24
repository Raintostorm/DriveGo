import { Controller, Get } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("plans")
export class PlansController {
  @Get()
  list() {
    dbNotConfigured("plans.list")
  }
}
