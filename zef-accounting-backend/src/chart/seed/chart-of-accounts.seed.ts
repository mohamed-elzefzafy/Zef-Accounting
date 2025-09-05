import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Account,
  AccountDocument,
  AccountType,
} from '../entities/chart.schema';

@Injectable()
export class ChartSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Account.name) private chartModel: Model<AccountDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.chartModel.countDocuments();
    if (count === 0) {
      await this.chartModel.insertMany([
        {
          name: 'asset',
          accountCode: '1000',
          type: AccountType.Asset,
          parent: null,
          children: [],
        },
        {
          name: 'liability',
          accountCode: '2000',
          type: AccountType.Liability,
          parent: null,
          children: [],
        },
        {
          name: 'equity',
          accountCode: '3000',
          type: AccountType.Equity,
          parent: null,
          children: [],
        },
        {
          name: 'revenue',
          accountCode: '4000',
          type: AccountType.Revenue,
          parent: null,
          children: [],
        },
        {
          name: 'expense',
          accountCode: '5000',
          type: AccountType.Expense,
          parent: null,
          children: [],
        },
      ]);
      console.log('✅ Seeded chart of accounts');
    }
  }
}
