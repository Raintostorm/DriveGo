import { IsObject, IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(16)
  licenseClass?: string

  @IsOptional()
  @IsObject()
  personalInfo?: Record<string, unknown>
}
