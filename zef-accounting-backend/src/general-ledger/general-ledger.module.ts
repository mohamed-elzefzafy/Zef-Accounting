import { Module } from '@nestjs/common';
import { GeneralLedgerController } from './general-ledger.controller';
import { GeneralLedgerService } from './general-ledger.service';
import { JournalEntryEntity, JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';

@Module({
  imports: [
TypeOrmModule.forFeature([JournalEntryEntity,JournalEntryLineEntity,AccountEntity]),
  ],
  controllers: [GeneralLedgerController],
  providers: [GeneralLedgerService],
})
export class GeneralLedgerModule {}
