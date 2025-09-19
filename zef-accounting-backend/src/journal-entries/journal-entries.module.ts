import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { JournalEntryEntity, JournalEntryLineEntity } from './entities/journal-entry.entity';
import { FiscalYearModule } from 'src/fiscal-year/fiscal-year.module';


@Module({
  imports: [
      TypeOrmModule.forFeature([AccountEntity , JournalEntryEntity,JournalEntryLineEntity]),
    JwtModule,
    FiscalYearModule,
  ],
  providers: [JournalEntriesService],
  controllers: [JournalEntriesController],
  exports:[JournalEntriesService],
})
export class JournalEntriesModule {}
