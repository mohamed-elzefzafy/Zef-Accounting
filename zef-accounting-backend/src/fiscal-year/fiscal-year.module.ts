// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';
// import { FiscalYearService } from './fiscal-year.service';
// import { FiscalYearController } from './fiscal-year.controller';
// import {
//   JournalEntryEntity,
//   JournalEntryLineEntity,
// } from 'src/journal-entries/entities/journal-entry.entity';
// import { JournalEntriesModule } from 'src/journal-entries/journal-entries.module';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       FiscalYearEntity,
//       JournalEntryEntity,
//       JournalEntryLineEntity,
//     ]),
//   ],
//   providers: [FiscalYearService],
//   controllers: [FiscalYearController],
//   exports: [FiscalYearService],
// })
// export class FiscalYearModule {}



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  FiscalYearEntity } from './entities/fiscal-year.entity';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYearController } from './fiscal-year.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalYearEntity]) ,JwtModule],
  providers: [FiscalYearService],
  controllers: [FiscalYearController],
  exports: [FiscalYearService], // 👈 عشان تستخدمها في JournalEntriesModule
})
export class FiscalYearModule {}
