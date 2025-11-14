import { Module } from '@nestjs/common';
import { GeneralLedgerController } from './general-ledger.controller';
import { GeneralLedgerService } from './general-ledger.service';
import { JournalEntryEntity, JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([JournalEntryEntity,JournalEntryLineEntity,AccountEntity , FiscalYearEntity]),
  ],
  controllers: [GeneralLedgerController],
  providers: [GeneralLedgerService],
})
export class GeneralLedgerModule {}
