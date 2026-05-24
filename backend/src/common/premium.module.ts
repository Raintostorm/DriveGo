import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExamAttempt } from "../entities/exam-attempt.entity"
import { StudentProfile } from "../entities/student-profile.entity"
import { PremiumService } from "./premium.service"

@Module({
  imports: [TypeOrmModule.forFeature([StudentProfile, ExamAttempt])],
  providers: [PremiumService],
  exports: [PremiumService],
})
export class PremiumModule {}
