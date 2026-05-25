import { IsISO8601, IsOptional } from "class-validator"

export class RequestDossierDto {
  @IsOptional()
  @IsISO8601()
  deadline?: string
}
