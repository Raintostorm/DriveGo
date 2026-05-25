import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CourseEnrollment } from "../entities/course-enrollment.entity"
import { LicenseClass } from "../entities/license-class.entity"
import { EnrollmentService } from "./enrollment.service"

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([CourseEnrollment, LicenseClass])],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
