// // src/opening-balance/opening-balance.module.ts

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OpeningBalanceEntity } from './entities/opening-balance.entity';
// import { OpeningBalanceService } from './opening-balance.service';
// import { OpeningBalanceController } from './opening-balance.controller';
// import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
// import { FiscalYearModule } from 'src/fiscal-year/fiscal-year.module';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([OpeningBalanceEntity, JournalEntryLineEntity]),
//     FiscalYearModule, // ✅ عشان نستخدم FiscalYearService
//     JwtModule,
//   ],

//   controllers: [OpeningBalanceController],
//   providers: [OpeningBalanceService],
//   exports: [OpeningBalanceService], // ✅ عشان تقرير الأستاذ يقدر يستخدمه
// })
// export class OpeningBalanceModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpeningBalanceEntity } from './entities/opening-balance.entity';
import { OpeningBalanceService } from './opening-balance.service';
import { OpeningBalanceController } from './opening-balance.controller';
import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { FiscalYearModule } from 'src/fiscal-year/fiscal-year.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpeningBalanceEntity, JournalEntryLineEntity]),
    forwardRef(() => FiscalYearModule), // ✅ عشان نستخدم FiscalYearService
    JwtModule,
  ],
  controllers: [OpeningBalanceController],
  providers: [OpeningBalanceService],
  exports: [OpeningBalanceService], // ✅ عشان FiscalYearService يستخدمه
})
export class OpeningBalanceModule {}
