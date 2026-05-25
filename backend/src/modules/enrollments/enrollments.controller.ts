import { Controller, Get, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { EnrollmentService } from "../../common/enrollment.service"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"

@Controller("enrollments")
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollment: EnrollmentService) {}

  @Get("me")
  listMine(@CurrentUser() user: AuthUser) {
    return this.enrollment.listForUser(user.userId)
  }
}
