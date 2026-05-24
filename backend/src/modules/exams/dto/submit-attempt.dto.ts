import { IsObject, IsOptional, IsString } from "class-validator"

export class SubmitAttemptDto {
  @IsObject()
  answers!: Record<string, number>

  @IsOptional()
  @IsString()
  startedAt?: string
}
