import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, AccountType } from '../entities/chart.entity';

@Injectable()
export class ChartSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.accountRepository.count();
    if (count === 0) {
      const accounts = [
        {
          name: 'asset',
          accountCode: '1000',
          type: AccountType.Asset,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'liability',
          accountCode: '2000',
          type: AccountType.Liability,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'equity',
          accountCode: '3000',
          type: AccountType.Equity,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'revenue',
          accountCode: '4000',
          type: AccountType.Revenue,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'expense',
          accountCode: '5000',
          type: AccountType.Expense,
          parent: null,
          isMain: true,
          isSub: false,
        },
      ];

      await this.accountRepository.save(accounts);
      console.log('✅ Seeded chart of accounts');
    }
  }
}
