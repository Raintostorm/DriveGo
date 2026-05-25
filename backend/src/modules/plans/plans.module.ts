import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExamPaper } from "../../entities/exam-paper.entity"
import { LicenseClass } from "../../entities/license-class.entity"
import { ScheduleSlot } from "../../entities/schedule-slot.entity"
import { StudyChapter } from "../../entities/study-chapter.entity"
import { SubscriptionPlan } from "../../entities/subscription-plan.entity"
import { LicenseClassesController } from "./license-classes.controller"
import { LicenseClassesService } from "./license-classes.service"
import { PlansController } from "./plans.controller"
import { PlansService } from "./plans.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LicenseClass,
      SubscriptionPlan,
      StudyChapter,
      ExamPaper,
      ScheduleSlot,
    ]),
  ],
  controllers: [PlansController, LicenseClassesController],
  providers: [PlansService, LicenseClassesService],
  exports: [LicenseClassesService],
})
export class PlansModule {}
