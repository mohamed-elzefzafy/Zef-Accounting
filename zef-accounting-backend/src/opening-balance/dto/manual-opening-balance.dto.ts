import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class ManualOpeningBalanceDto {
  @IsInt()
  @IsPositive()
  fiscalYear!: number;

  @IsInt()
  @IsPositive()
  accountId!: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  costCenterId?: number;

  @IsNumber()
  @Min(0)
  debit!: number;

  @IsNumber()
  @Min(0)
  credit!: number;
}
