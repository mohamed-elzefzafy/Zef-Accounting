import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralLedgerService } from './general-ledger.service';
import { GeneralLedgerController } from './general-ledger.controller';
import { JournalEntryEntity, JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';
import { OpeningBalanceModule } from 'src/opening-balance/opening-balance.module';
import { OpeningBalanceEntity } from 'src/opening-balance/entities/opening-balance.entity'; // ✅ أضف الـ entity

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntryEntity,
      JournalEntryLineEntity,
      AccountEntity,
      FiscalYearEntity,
      OpeningBalanceEntity, // ✅ ده اللي ناقص
    ]),
    OpeningBalanceModule,
  ],
  providers: [GeneralLedgerService],
  controllers: [GeneralLedgerController],
})
export class GeneralLedgerModule {}