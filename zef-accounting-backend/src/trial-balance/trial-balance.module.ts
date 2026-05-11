import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrialBalanceController } from './trial-balance.controller';
import { TrialBalanceService }    from './trial-balance.service';
import { AccountEntity }          from 'src/chart/entities/chart.entity';
import {  JournalEntryLineEntity }     from 'src/journal-entries/entities/journal-entry.entity';
import { OpeningBalanceEntity } from 'src/opening-balance/entities/opening-balance.entity';
import { FiscalYearModule } from 'src/fiscal-year/fiscal-year.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, JournalEntryLineEntity , OpeningBalanceEntity]),
    FiscalYearModule,
  ],
  controllers: [TrialBalanceController],
  providers:   [TrialBalanceService],
  exports:     [TrialBalanceService],
})
export class TrialBalanceModule {}