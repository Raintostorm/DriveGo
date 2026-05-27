import { IsOptional, IsString, MaxLength, MinLength } from "class-validator"

export class CreateCenterAdminDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxCode?: string

  @IsOptional()
  @IsString()
  @MaxLength(128)
  city?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string
}
