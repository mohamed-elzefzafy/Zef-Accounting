import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';

export class JournalEntryLineDto {
  @IsNumber()
  @IsNotEmpty()
  account: number;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;

  @IsNumber()
  @IsOptional()
  costCenter?: number;
}

export class CreateJournalEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  entries: JournalEntryLineDto[];
}
