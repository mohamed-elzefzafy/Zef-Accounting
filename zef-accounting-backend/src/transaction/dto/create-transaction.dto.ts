import { IsMongoId, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EntryDto {
  @IsMongoId()
  account: string;

  @IsString()
  type: 'debit' | 'credit';

  @IsNumber()
  amount: number;
}

export class CreateTransactionDto {
  @IsMongoId()
  user: string;

  @IsMongoId()
  @IsOptional()
  account?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsMongoId()
  costCenter?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries?: EntryDto[];
}
