import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateCenterAdminUserDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string

  @IsUUID()
  centerId!: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  fullName?: string
}
