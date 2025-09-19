import { Module } from '@nestjs/common';
import { GeneralLedgerController } from './general-ledger.controller';
import { GeneralLedgerService } from './general-ledger.service';
import { JournalEntryEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
TypeOrmModule.forFeature([JournalEntryEntity]),
  ],
  controllers: [GeneralLedgerController],
  providers: [GeneralLedgerService],
})
export class GeneralLedgerModule {}
