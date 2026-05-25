import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationDocument } from "../../entities/application-document.entity"
import { CourseEnrollment } from "../../entities/course-enrollment.entity"
import { LicenseApplication } from "../../entities/license-application.entity"
import { ExamRegistration, ScheduleSlot } from "../../entities/schedule-slot.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { ApplicationsModule } from "../applications/applications.module"
import { AuthModule } from "../auth/auth.module"
import { NotificationsModule } from "../notifications/notifications.module"
import { AdminApplicationsController } from "./admin-applications.controller"
import { AdminApplicationsService } from "./admin-applications.service"
import { AdminDashboardController } from "./admin-dashboard.controller"
import { AdminDashboardService } from "./admin-dashboard.service"
import { AdminSchedulesController } from "./admin-schedules.controller"
import { AdminSchedulesService } from "./admin-schedules.service"
import { AdminStudentsController } from "./admin-students.controller"
import { AdminStudentsService } from "./admin-students.service"
import { AdminScopeService } from "./admin-scope.service"
import { RolesGuard } from "../../common/guards/roles.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LicenseApplication,
      ApplicationDocument,
      ScheduleSlot,
      ExamRegistration,
      User,
      StudentProfile,
      CourseEnrollment,
    ]),
    AuthModule,
    ApplicationsModule,
    NotificationsModule,
  ],
  controllers: [
    AdminApplicationsController,
    AdminSchedulesController,
    AdminDashboardController,
    AdminStudentsController,
  ],
  providers: [
    RolesGuard,
    AdminScopeService,
    AdminApplicationsService,
    AdminSchedulesService,
    AdminDashboardService,
    AdminStudentsService,
  ],
})
export class AdminModule {}
