import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TrainingCenter } from "../../entities/schedule-slot.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { AuthModule } from "../auth/auth.module"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, StudentProfile, TrainingCenter]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
