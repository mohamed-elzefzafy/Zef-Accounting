// src/opening-balance/dto/generate-opening-balance.dto.ts

import { IsInt, IsPositive } from 'class-validator';

export class GenerateOpeningBalanceDto {
  @IsInt()
  @IsPositive()
  year!: number;
  // السنة اللي عايز تولد opening balance ليها
  // يعني لو بتقفل 2024 → هيولد opening balance لـ 2025
}