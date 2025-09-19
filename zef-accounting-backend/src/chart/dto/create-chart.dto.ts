import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from '../entities/chart.entity';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(AccountType, {
    message: 'Type must be one of Asset, Liability, Equity, Revenue, Expense',
  })
  type: AccountType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;
}
