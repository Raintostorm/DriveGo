import { Controller, Get, Param, Post } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("exams")
export class ExamsController {
  @Get("attempts/history")
  history() {
    dbNotConfigured("exams.history")
  }

  @Get(":paperId")
  getPaper(@Param("paperId") _paperId: string) {
    dbNotConfigured("exams.getPaper")
  }

  @Post(":paperId/attempts")
  submitAttempt(@Param("paperId") _paperId: string) {
    dbNotConfigured("exams.submitAttempt")
  }
}
