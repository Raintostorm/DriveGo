import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExamRegistration, ScheduleSlot } from "../../entities/schedule-slot.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { ApplicationsModule } from "../applications/applications.module"
import { AuthModule } from "../auth/auth.module"
import { SchedulesController } from "./schedules.controller"
import { SchedulesService } from "./schedules.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleSlot, ExamRegistration, StudentProfile]),
    AuthModule,
    ApplicationsModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
