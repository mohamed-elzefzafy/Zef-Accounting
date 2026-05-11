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
          accountCode: '1',
          type: AccountType.Asset,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'liability',
          accountCode: '2',
          type: AccountType.Liability,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'equity',
          accountCode: '3',
          type: AccountType.Equity,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'revenue',
          accountCode: '4',
          type: AccountType.Revenue,
          parent: null,
          isMain: true,
          isSub: false,
        },
        {
          name: 'expense',
          accountCode: '5',
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
