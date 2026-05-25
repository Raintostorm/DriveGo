import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ApplicationDocument } from "../../entities/application-document.entity"
import { LicenseApplication } from "../../entities/license-application.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { AuthModule } from "../auth/auth.module"
import { ApplicationsController } from "./applications.controller"
import { ApplicationsService } from "./applications.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([LicenseApplication, ApplicationDocument, StudentProfile]),
    AuthModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
