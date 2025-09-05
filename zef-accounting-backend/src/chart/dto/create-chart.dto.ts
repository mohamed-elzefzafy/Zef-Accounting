import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountType } from '../entities/chart.schema';

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
  @IsString()
  parentId?: string;
}
