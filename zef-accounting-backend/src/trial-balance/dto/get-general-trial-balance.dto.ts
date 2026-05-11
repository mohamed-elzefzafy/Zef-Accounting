import { IsOptional, IsInt, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTrialBalanceDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  // فلتر مستوى الحسابات (1 = رئيسي فقط، 2 = ثاني، إلخ)
  // لو مش موجود → كل المستويات
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  level?: number;
}
