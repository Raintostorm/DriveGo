import { IsIn, IsOptional, IsString, MaxLength } from "class-validator"

export class PatchApplicationAdminDto {
  @IsIn(["reviewing", "approved", "rejected"])
  status!: "reviewing" | "approved" | "rejected"

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string
}
