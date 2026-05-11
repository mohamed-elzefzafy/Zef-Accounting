import { Controller, Get, Query } from '@nestjs/common';
import { TrialBalanceService } from './trial-balance.service';
import { GetTrialBalanceDto } from './dto/get-general-trial-balance.dto';
import { GetAccountTrialBalanceDto } from './dto/get-account-trial-balance.dto';


@Controller('api/v1/trial-balance')
export class TrialBalanceController {
  constructor(private readonly trialBalanceService: TrialBalanceService) {}

  // ─── GET /trial-balance?startDate=&endDate=&level= ────────
  @Get()
  getCompanyTrialBalance(@Query() dto: GetTrialBalanceDto) {
    return this.trialBalanceService.getCompanyTrialBalance(dto);
  }

  // ─── GET /trial-balance/account?accountId=&startDate=&endDate= ──
  @Get('account')
  getAccountTrialBalance(@Query() dto: GetAccountTrialBalanceDto) {
    return this.trialBalanceService.getAccountTrialBalance(dto);
  }
}
