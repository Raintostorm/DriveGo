import { Controller, Get, Query } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("lookup")
export class LookupController {
  @Get()
  lookup(@Query("code") _code?: string) {
    dbNotConfigured("lookup.search")
  }
}
