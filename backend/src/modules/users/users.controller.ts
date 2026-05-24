import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { UpdateMeDto } from "./dto/update-me.dto"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.usersService.getMe(user.userId)
  }

  @Patch("me")
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user: AuthUser, @Body() body: UpdateMeDto) {
    return this.usersService.updateMe(user.userId, body)
  }
}
