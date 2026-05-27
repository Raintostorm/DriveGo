import { IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateSlotAdminDto {
  @IsOptional()
  @IsUUID()
  centerId?: string

  @IsString()
  slotDate!: string

  @IsString()
  startTime!: string

  @IsString()
  endTime!: string

  @IsOptional()
  @IsString()
  venue?: string

  @IsOptional()
  @IsString()
  licenseClass?: string

  @IsIn(["theory_exam", "road_test"])
  slotType!: "theory_exam" | "road_test"

  @IsInt()
  @Min(1)
  capacity!: number
}
