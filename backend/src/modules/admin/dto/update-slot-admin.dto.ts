import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator"

export class UpdateSlotAdminDto {
  @IsOptional()
  @IsString()
  slotDate?: string

  @IsOptional()
  @IsString()
  startTime?: string

  @IsOptional()
  @IsString()
  endTime?: string

  @IsOptional()
  @IsString()
  venue?: string

  @IsOptional()
  @IsString()
  licenseClass?: string

  @IsOptional()
  @IsIn(["theory_exam", "road_test"])
  slotType?: "theory_exam" | "road_test"

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number
}
