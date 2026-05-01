// src/opening-balance/opening-balance.controller.ts

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OpeningBalanceService } from './opening-balance.service';
import { GenerateOpeningBalanceDto } from './dto/generate-opening-balance.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';

@Controller('api/v1/opening-balance')
export class OpeningBalanceController {
  constructor(private readonly openingBalanceService: OpeningBalanceService) {}

  // ✅ توليد Opening Balance من قيود السنة السابقة
  @Post('generate')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  generate(@Body() dto: GenerateOpeningBalanceDto) {
    return this.openingBalanceService.generate(dto.year);
  }

  // ✅ جيب كل الأرصدة الافتتاحية لسنة
  @Get()
    @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  findAll(@Query('year', ParseIntPipe) year: number) {
    return this.openingBalanceService.findAllForYear(year);
  }

  // ✅ جيب Opening Balance لحساب معين (مع أو بدون مركز تكلفة)
  @Get('account')
    @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  getForAccount(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('costCenterId') costCenterId?: string,
  ) {
    return this.openingBalanceService.getForAccount(
      accountId,
      year,
      costCenterId ? parseInt(costCenterId) : undefined,
    );
  }

  // ✅ للاستخدام في تقرير الأستاذ
  @Get('ledger')
    @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  getForLedger(
    @Query('accountId', ParseIntPipe) accountId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('costCenterId') costCenterId?: string,
  ) {
    return this.openingBalanceService.getOpeningBalanceForLedger(
      accountId,
      year,
      costCenterId ? parseInt(costCenterId) : undefined,
    );
  }
}