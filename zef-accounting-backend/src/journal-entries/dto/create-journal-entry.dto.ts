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
  @IsMongoId()
  @IsNotEmpty()
  account: string;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;

  @IsMongoId()
  @IsOptional()
  costCenter?: string;
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
