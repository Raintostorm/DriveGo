import { IsIn, IsOptional, IsString, MaxLength } from "class-validator"

export class PatchRegistrationAdminDto {
  @IsIn(["confirmed", "rejected"])
  status!: "confirmed" | "rejected"

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string
}
