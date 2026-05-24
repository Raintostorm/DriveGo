import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"

export enum UserRole {
  STUDENT = "student",
  CENTER_ADMIN = "center_admin",
  SYSTEM_ADMIN = "system_admin",
}

export class RegisterDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsString()
  phone?: string
}

export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string
}

export class GoogleLoginDto {
  @IsString()
  idToken!: string
}
