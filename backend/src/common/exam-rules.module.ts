import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LicenseClass } from "../entities/license-class.entity"
import { ExamRulesService } from "./exam-rules.service"

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LicenseClass])],
  providers: [ExamRulesService],
  exports: [ExamRulesService],
})
export class ExamRulesModule {}
