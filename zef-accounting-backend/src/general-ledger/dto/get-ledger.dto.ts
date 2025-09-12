import { IsMongoId, IsOptional, IsDateString } from 'class-validator';

export class GetLedgerDto {
  @IsMongoId()
  accountId: string; // ID of account from COA

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsMongoId()
  costCenter: string;
}
