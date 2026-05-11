import {  IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';

export class GetLedgerDto {
  @IsNumber()
  accountId!: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  costCenter?: number;
}
