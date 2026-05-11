import { IsOptional, IsInt, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAccountTrialBalanceDto {
  @IsInt()
  @Type(() => Number)
  accountId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  costCenter?: number;
}