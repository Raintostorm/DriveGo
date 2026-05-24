import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { StudentProfile } from "../../entities/student-profile.entity"
import { User } from "../../entities/user.entity"
import { AuthModule } from "../auth/auth.module"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, StudentProfile]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
