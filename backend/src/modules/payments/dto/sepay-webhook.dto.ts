import { IsIn, IsInt, IsOptional, IsString } from "class-validator"

export class SepayWebhookDto {
  @IsInt()
  id!: number

  @IsOptional()
  @IsString()
  gateway?: string

  @IsOptional()
  @IsString()
  transactionDate?: string

  @IsOptional()
  @IsString()
  accountNumber?: string

  @IsOptional()
  @IsString()
  subAccount?: string

  @IsOptional()
  @IsString()
  code?: string | null

  @IsOptional()
  @IsString()
  content?: string

  @IsString()
  @IsIn(["in", "out"])
  transferType!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsInt()
  transferAmount!: number

  @IsOptional()
  @IsInt()
  accumulated?: number

  @IsOptional()
  @IsString()
  referenceCode?: string
}
