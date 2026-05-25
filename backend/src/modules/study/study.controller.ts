import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { StudyService } from "./study.service"

@Controller("study")
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  @Get("chapters")
  @UseGuards(JwtAuthGuard)
  listChapters(
    @CurrentUser() user: AuthUser,
    @Query("licenseClass") licenseClass?: string,
  ) {
    return this.studyService.listChapters(user.userId, licenseClass)
  }

  @Get("chapters/:id")
  @UseGuards(JwtAuthGuard)
  getChapter(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.studyService.getChapter(user.userId, id)
  }

  @Get("dashboard-summary")
  @UseGuards(JwtAuthGuard)
  dashboardSummary(@CurrentUser() user: AuthUser) {
    return this.studyService.dashboardSummary(user.userId)
  }

  @Patch("chapters/:id/progress")
  @UseGuards(JwtAuthGuard)
  updateProgress(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: { percent: number },
  ) {
    return this.studyService.updateProgress(user.userId, id, body.percent ?? 0)
  }
}
