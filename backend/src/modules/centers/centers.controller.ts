import { Controller, Get, Post } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("centers")
export class CentersController {
  @Post("register")
  register() {
    dbNotConfigured("centers.register")
  }

  @Get("admin/dashboard")
  adminDashboard() {
    dbNotConfigured("centers.adminDashboard")
  }
}
