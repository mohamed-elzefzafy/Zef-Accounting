
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';
// import { FiscalYearService } from './fiscal-year.service';
// import { FiscalYearController } from './fiscal-year.controller';
// import { JwtModule } from '@nestjs/jwt';
// import {
//   JournalEntryEntity,
//   JournalEntryLineEntity,
// } from 'src/journal-entries/entities/journal-entry.entity';
// import { AccountEntity } from 'src/chart/entities/chart.entity';
// import { UsersModule } from 'src/users/users.module';
// import { UserEntity } from 'src/users/entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       FiscalYearEntity,
//       JournalEntryEntity,
//       JournalEntryLineEntity,
//       AccountEntity,
//       UserEntity,
//     ]),
//     JwtModule,
//     UsersModule,
//   ],
//   providers: [FiscalYearService],
//   controllers: [FiscalYearController],
//   exports: [FiscalYearService], // 👈 عشان تستخدمها في JournalEntriesModule
// })
// export class FiscalYearModule {}






import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiscalYearEntity } from './entities/fiscal-year.entity';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYearController } from './fiscal-year.controller';
import { JwtModule } from '@nestjs/jwt';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from 'src/journal-entries/entities/journal-entry.entity';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { UsersModule } from 'src/users/users.module';
import { UserEntity } from 'src/users/entities/user.entity';
import { OpeningBalanceModule } from 'src/opening-balance/opening-balance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FiscalYearEntity,
      JournalEntryEntity,
      JournalEntryLineEntity,
      AccountEntity,
      UserEntity,
    ]),
    JwtModule,
    UsersModule,
  forwardRef(() => OpeningBalanceModule),   // ✅ عشان FiscalYearService يقدر يستخدم OpeningBalanceService
  ],
  providers: [FiscalYearService],
  controllers: [FiscalYearController],
  exports: [FiscalYearService],
})
export class FiscalYearModule {}
