import { IsNumber } from 'class-validator';

export class CloseFiscalYearDto {
  @IsNumber()
  year: number;
}
