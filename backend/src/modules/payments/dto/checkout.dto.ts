import { IsEmail, IsIn, IsOptional, IsString } from "class-validator"

export class CheckoutDto {
  @IsIn(["premium", "enrollment"])
  paymentType!: "premium" | "enrollment"

  @IsOptional()
  @IsString()
  planCode?: string

  @IsOptional()
  @IsString()
  licenseClass?: string

  @IsOptional()
  @IsString()
  fullName?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
