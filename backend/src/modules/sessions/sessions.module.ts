import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ClassSession } from "../../entities/class-session.entity"
import { SessionAttendance } from "../../entities/session-attendance.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { AuthModule } from "../auth/auth.module"
import { SessionsController } from "./sessions.controller"
import { SessionsService } from "./sessions.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassSession, SessionAttendance, StudentProfile]),
    AuthModule,
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
