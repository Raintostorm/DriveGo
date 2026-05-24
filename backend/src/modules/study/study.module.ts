import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LicenseClass } from "../../entities/license-class.entity"
import { StudyChapter } from "../../entities/study-chapter.entity"
import { StudyProgress } from "../../entities/study-progress.entity"
import { AuthModule } from "../auth/auth.module"
import { StudyController } from "./study.controller"
import { StudyService } from "./study.service"

@Module({
  imports: [
    TypeOrmModule.forFeature([StudyChapter, StudyProgress, LicenseClass]),
    AuthModule,
  ],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
