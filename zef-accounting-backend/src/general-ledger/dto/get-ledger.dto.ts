import { IsMongoId, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class GetLedgerDto {
  @IsNumber()
  accountId: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  costCenter?: number;
}
