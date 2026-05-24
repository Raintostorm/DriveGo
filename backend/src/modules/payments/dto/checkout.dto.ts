import { IsEmail, IsOptional, IsString } from "class-validator"

export class CheckoutDto {
  @IsString()
  planCode!: string

  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
