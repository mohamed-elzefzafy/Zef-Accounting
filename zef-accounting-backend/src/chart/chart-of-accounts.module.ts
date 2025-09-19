import { Module } from '@nestjs/common';
import { ChartSeeder } from './seed/chart-of-accounts.seed';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { AccountEntity } from './entities/chart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [ChartOfAccountsController],
  providers: [ChartOfAccountsService, ChartSeeder],
  exports: [ChartOfAccountsService],
})
export class ChartOfAccountsModule {}
