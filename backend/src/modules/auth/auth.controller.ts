import { Body, Controller, Post } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"
import { ForgotPasswordDto, LoginDto, RegisterDto } from "./dto/auth.dto"

@Controller("auth")
export class AuthController {
  @Post("register")
  register(@Body() _body: RegisterDto) {
    dbNotConfigured("auth.register")
  }

  @Post("login")
  login(@Body() _body: LoginDto) {
    dbNotConfigured("auth.login")
  }

  @Post("forgot-password")
  forgotPassword(@Body() _body: ForgotPasswordDto) {
    dbNotConfigured("auth.forgot-password")
  }
}
