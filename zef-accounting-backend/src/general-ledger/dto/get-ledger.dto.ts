import {  IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { JournalEntryType } from 'src/shared/enums/jornal-entries.enum';

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

  @IsEnum(JournalEntryType)
  @IsOptional()
  type?: JournalEntryType = JournalEntryType.NORMAL;
}
