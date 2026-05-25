import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExamAttempt } from "../../entities/exam-attempt.entity"
import { ExamPaper } from "../../entities/exam-paper.entity"
import { Question } from "../../entities/question.entity"
import { PremiumModule } from "../../common/premium.module"
import { AuthModule } from "../auth/auth.module"
import { ExamsController } from "./exams.controller"
import { ExamsService } from "./exams.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamPaper, Question, ExamAttempt]),
    AuthModule,
    PremiumModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
