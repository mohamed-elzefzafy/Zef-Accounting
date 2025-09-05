import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './entities/chart.schema';
import { ChartSeeder } from './seed/chart-of-accounts.seed';
import { ChartOfAccountsController } from './chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [ChartOfAccountsController],
  providers: [ChartOfAccountsService, ChartSeeder],
  exports: [ChartOfAccountsService],
})
export class ChartOfAccountsModule {}
