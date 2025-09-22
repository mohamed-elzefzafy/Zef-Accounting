// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import { CloseFiscalYearDto } from './dto/close-fiscal-year.dto';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { JournalEntriesService } from 'src/journal-entries/journal-entries.service';

// @Injectable()
// export class FiscalYearService {
//   constructor(
//     @InjectRepository(FiscalYearEntity)
//     private readonly fiscalYearRepo: Repository<FiscalYearEntity>,
//   ) {}

//   async create(dto: CreateFiscalYearDto): Promise<FiscalYearEntity> {
//     const exists = await this.fiscalYearRepo.findOne({ where: { year: dto.year } });
//     if (exists) {
//       throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
//     }

//     const fiscalYear = this.fiscalYearRepo.create(dto);
//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   async findAll(): Promise<FiscalYearEntity[]> {
//     return this.fiscalYearRepo.find({ order: { year: 'ASC' } });
//   }

//   async findOne(year: number): Promise<FiscalYearEntity> {
//     const fy = await this.fiscalYearRepo.findOne({ where: { year } });
//     if (!fy) throw new NotFoundException(`Fiscal year ${year} not found`);
//     return fy;
//   }

//   async close(dto: CloseFiscalYearDto, user: UserEntity): Promise<FiscalYearEntity> {
//     const fy = await this.findOne(dto.year);

//     if (fy.isClosed) {
//       throw new BadRequestException(`Fiscal year ${dto.year} is already closed`);
//     }

//     fy.isClosed = true;
//     fy.closedAt = new Date();
//     fy.closedBy = user;

//     return this.fiscalYearRepo.save(fy);
//   }
// }


// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';

// @Injectable()
// export class FiscalYearService {
//   constructor(
//     @InjectRepository(FiscalYearEntity)
//     private readonly fiscalYearRepo: Repository<FiscalYearEntity>,
//   ) {}

//   // إنشاء سنة مالية جديدة
//   async create(dto: CreateFiscalYearDto) {
//     const existing = await this.fiscalYearRepo.findOne({ where: { year: dto.year } });
//     if (existing) {
//       throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
//     }

//     const fiscalYear = this.fiscalYearRepo.create({
//       year: dto.year,
//       isClosed: false,
//     });

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // جلب كل السنوات المالية
//   async findAll() {
//     return this.fiscalYearRepo.find({ order: { year: 'ASC' } });
//   }

//   // جلب سنة مالية معينة
//   async findOne(year: number) {
//     const fiscalYear = await this.fiscalYearRepo.findOne({ where: { year } });
//     if (!fiscalYear) {
//       throw new NotFoundException(`Fiscal year ${year} not found`);
//     }
//     return fiscalYear;
//   }

//   // قفل السنة المالية
//   async closeYear(year: number, userId: string) {
//     const fiscalYear = await this.findOne(year);

//     if (fiscalYear.isClosed) {
//       throw new BadRequestException(`Fiscal year ${year} is already closed`);
//     }

//     fiscalYear.isClosed = true;
//     fiscalYear.closedAt = new Date();
//     fiscalYear.closedBy = userId;

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // فتح السنة المالية (إلغاء القفل)
//   async openYear(year: number) {
//     const fiscalYear = await this.findOne(year);

//     if (!fiscalYear.isClosed) {
//       throw new BadRequestException(`Fiscal year ${year} is already open`);
//     }

//     fiscalYear.isClosed = false;
//     fiscalYear.closedAt = null;
//     fiscalYear.closedBy = null;

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // جلب السنة الحالية (أحدث سنة غير مقفولة)
//   async getCurrentYear() {
//     const fiscalYear = await this.fiscalYearRepo.findOne({
//       where: { isClosed: false },
//       order: { year: 'DESC' },
//     });

//     if (!fiscalYear) {
//       throw new NotFoundException('No active fiscal year found');
//     }

//     return fiscalYear;
//   }
// }



import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeepPartial, Repository ,DataSource} from 'typeorm';
import {  FiscalYearEntity } from './entities/fiscal-year.entity';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { JournalEntryEntity, JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { AccountEntity, AccountType } from 'src/chart/entities/chart.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class FiscalYearService {
  constructor(
    @InjectRepository(FiscalYearEntity)
    private readonly fiscalYearRepository: Repository<FiscalYearEntity>,
        @InjectRepository(JournalEntryEntity)
        private readonly journalEntryRepository: Repository<JournalEntryEntity>,
              @InjectRepository(JournalEntryLineEntity)
        private readonly journalEntryLineRepository: Repository<JournalEntryLineEntity>,
            @InjectRepository(AccountEntity)
            private readonly accountRepository: Repository<AccountEntity>,

                @InjectRepository(UserEntity)
    private readonly userRepositry: Repository<UserEntity>,
           private readonly dataSource: DataSource,  
  ) {}

  async create(dto: CreateFiscalYearDto) {
    const existing = await this.fiscalYearRepository.findOne({ where: { year: dto.year } });
    if (existing) {
      throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
    }

    const fiscalYear = this.fiscalYearRepository.create({
      year: dto.year,
      isClosed: false,
    });

    return this.fiscalYearRepository.save(fiscalYear);
  }

  async findAll() {
    return this.fiscalYearRepository.find({ order: { year: 'ASC' } });
  }

  async findOne(year: number) {
    const fiscalYear = await this.fiscalYearRepository.findOne({ where: { year } });
    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year ${year} not found`);
    }
    return fiscalYear;
  }

  // async closeYear(year: number, userId: string) {
  //   const fiscalYear = await this.findOne(year);

  //   if (fiscalYear.isClosed) {
  //     throw new BadRequestException(`Fiscal year ${year} is already closed`);
  //   }

  //   fiscalYear.isClosed = true;
  //   fiscalYear.closedAt = new Date();
  //   fiscalYear.closedBy = userId;

  //   return this.fiscalYearRepo.save(fiscalYear);
  // }

  // async openYear(year: number) {
  //   const fiscalYear = await this.findOne(year);

  //   if (!fiscalYear.isClosed) {
  //     throw new BadRequestException(`Fiscal year ${year} is already open`);
  //   }

  //   fiscalYear.isClosed = false;
  //   fiscalYear.closedAt = null;
  //   fiscalYear.closedBy = null;

  //   return this.fiscalYearRepo.save(fiscalYear);
  // }

  async getCurrentYear() {
    const fiscalYear = await this.fiscalYearRepository.findOne({
      where: { isClosed: false },
      order: { year: 'DESC' },
    });

    if (!fiscalYear) {
      throw new NotFoundException('No active fiscal year found');
    }

    return fiscalYear;
  }



    // 📌 إقفال السنة
  // async closeYear(year: number) {
  //   const fiscalYear = await this.fiscalYearRepo.findOne({ where: { year } });
  //   if (!fiscalYear) throw new NotFoundException(`Fiscal year ${year} not found`);
  //   if (fiscalYear.isClosed) {
  //     throw new BadRequestException(`Fiscal year ${year} already closed`);
  //   }

  //   const start = new Date(`${year}-01-01`);
  //   const end = new Date(`${year}-12-31`);

  //   const entries = await this.journalEntryRepository.find({
  //     where: { date: Between(start, end) },
  //     relations: ['entries', 'entries.account'],
  //   });

  //   if (!entries.length) {
  //     throw new NotFoundException(`No journal entries found for year ${year}`);
  //   }

  //   let totalRevenue = 0;
  //   let totalExpense = 0;

  //   for (const entry of entries) {
  //     for (const line of entry.entries) {
  //       if (line.account.type === 'Revenue') {
  //         totalRevenue += line.credit - line.debit;
  //       }
  //       if (line.account.type === 'Expense') {
  //         totalExpense += line.debit - line.credit;
  //       }
  //     }
  //   }

  //   const income = totalRevenue - totalExpense;

  //   // نجيب حسابات أساسية
  //   const incomeSummary = await this.accountRepository.findOneByOrFail({
  //     name: 'income_summary',
  //   });
  //   const retainedEarnings = await this.accountRepository.findOneByOrFail({
  //     name: 'retained_earnings',
  //   });

  //   // قيد الإقفال
  //   const closingEntry = this.journalEntryRepository.create({
  //     date: end,
  //     description: `Closing entry for year ${year}`,
  //     entries: [
  //       this.journalEntryLineRepository.create({
  //         account: incomeSummary,
  //         debit: totalRevenue,
  //         credit: 0,
  //       }),
  //       this.journalEntryLineRepository.create({
  //         account: incomeSummary,
  //         debit: 0,
  //         credit: totalExpense,
  //       }),
  //       income >= 0
  //         ? this.journalEntryLineRepository.create({
  //             account: retainedEarnings,
  //             debit: 0,
  //             credit: income,
  //           })
  //         : this.journalEntryLineRepository.create({
  //             account: retainedEarnings,
  //             debit: -income,
  //             credit: 0,
  //           }),
  //     ],
  //   });

  //   await this.journalEntryRepository.save(closingEntry);

  //   fiscalYear.isClosed = true;
  //   fiscalYear.closedAt = new Date();
  //   await this.fiscalYearRepo.save(fiscalYear);

  //   return { message: 'Year closed successfully', year, income };
  // }

//   async closeYear(year: number) {
//   const fiscalYear = await this.fiscalYearRepo.findOne({ where: { year } });
//   if (!fiscalYear) throw new NotFoundException(`Fiscal year ${year} not found`);
//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${year} already closed`);
//   }

//   const start = new Date(`${year}-01-01`);
//   const end = new Date(`${year}-12-31`);

//   const entries = await this.journalEntryRepository.find({
//     where: { date: Between(start, end) },
//     relations: ['entries', 'entries.account'],
//   });

//   if (!entries.length) {
//     throw new NotFoundException(`No journal entries found for year ${year}`);
//   }

//   let totalRevenue = 0;
//   let totalExpense = 0;

//   for (const entry of entries) {
//     for (const line of entry.entries) {
//       if (line.account.type === 'Revenue') {
//         totalRevenue += line.credit - line.debit;
//       }
//       if (line.account.type === 'Expense') {
//         totalExpense += line.debit - line.credit;
//       }
//     }
//   }

//   const income = totalRevenue - totalExpense;

//   // نجيب حسابات أساسية أو ننشئها لو مش موجودة
//   let incomeSummary = await this.accountRepository.findOne({
//     where: { accountCode: '9999' }, // كود افتراضي لـ income_summary
//   });
//   if (!incomeSummary) {
//     incomeSummary = this.accountRepository.create({
//       accountCode: '9999',
//       name: 'income_summary',
//       type: 'Equity',
//     });
//     await this.accountRepository.save(incomeSummary);
//   }

//   let retainedEarnings = await this.accountRepository.findOne({
//     where: { accountCode: '9998' }, // كود افتراضي لـ retained_earnings
//   });
//   if (!retainedEarnings) {
//     retainedEarnings = this.accountRepository.create({
//       accountCode: '9998',
//       name: 'retained_earnings',
//       type: 'Equity',
//     });
//     await this.accountRepository.save(retainedEarnings);
//   }

//   // قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: end,
//     description: `Closing entry for year ${year}`,
//     entries: [
//       this.journalEntryLineRepository.create({
//         account: incomeSummary,
//         debit: totalRevenue,
//         credit: 0,
//       }),
//       this.journalEntryLineRepository.create({
//         account: incomeSummary,
//         debit: 0,
//         credit: totalExpense,
//       }),
//       income >= 0
//         ? this.journalEntryLineRepository.create({
//             account: retainedEarnings,
//             debit: 0,
//             credit: income,
//           })
//         : this.journalEntryLineRepository.create({
//             account: retainedEarnings,
//             debit: -income,
//             credit: 0,
//           }),
//     ],
//   });

//   await this.journalEntryRepository.save(closingEntry);

//   fiscalYear.isClosed = true;
//   fiscalYear.closedAt = new Date();
//   await this.fiscalYearRepo.save(fiscalYear);

//   return { message: 'Year closed successfully', year, income };
// }


// fiscal-year.service.ts

// async closeYear(year: number) {
//   // 1) جيب السنة المالية
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year: year },
//     relations: ['journalEntries', 'journalEntries.entries', 'journalEntries.entries.account'],
//   });

//   if (!fiscalYear) {
//     throw new Error('Fiscal year not found');
//   }
//   if (fiscalYear.isClosed) {
//     throw new Error('Fiscal year is already closed');
//   }

//   // 2) جيب كل الحسابات من شجرة الحسابات
//   const accounts = await this.accountRepository.find();

//   // 3) فلترة الإيرادات والمصروفات
//   const revenueAccounts = accounts.filter((a) => a.type === AccountType.Revenue);
//   const expenseAccounts = accounts.filter((a) => a.type === AccountType.Expense);

//   // 4) حساب الإجمالي
//   let totalRevenue = 0;
//   let totalExpense = 0;

//   for (const entry of fiscalYear.journalEntries) {
//     for (const line of entry.entries) {
//       if (line.account.type === AccountType.Revenue) {
//         totalRevenue += Number(line.credit) - Number(line.debit);
//       }
//       if (line.account.type === AccountType.Expense) {
//         totalExpense += Number(line.debit) - Number(line.credit);
//       }
//     }
//   }

//   const netIncome = totalRevenue - totalExpense;

//   // 5) إنشاء حساب Income Summary لو مش موجود
//   let incomeSummary = await this.accountRepository.findOne({
//     where: { name: 'Income Summary' },
//   });

//   if (!incomeSummary) {
//     incomeSummary = this.accountRepository.create({
//       name: 'Income Summary',
//       type: AccountType.Equity,
//       accountCode: '3999',
//       isMain: false,
//       isSub: true,
//     });
//     await this.accountRepository.save(incomeSummary);
//   }

//   // 6) إنشاء حساب Retained Earnings لو مش موجود
//   let retainedEarnings = await this.accountRepository.findOne({
//     where: { name: 'Retained Earnings' },
//   });

//   if (!retainedEarnings) {
//     retainedEarnings = this.accountRepository.create({
//       name: 'Retained Earnings',
//       type: AccountType.Equity,
//       accountCode: '3100',
//       isMain: false,
//       isSub: true,
//     });
//     await this.accountRepository.save(retainedEarnings);
//   }

//   // 7) إنشاء قيد إقفال السنة
//   const closingEntry = this.journalEntryRepository.create({
//     description: `Closing entries for Fiscal Year ${fiscalYear.year}`,
//     date: new Date(),
//     fiscalYear,
//     entries: [],
//   });

//   // إقفال الإيرادات: تحويلها إلى Income Summary
//   for (const acc of revenueAccounts) {
//     closingEntry.entries.push(
//       this.journalEntryLineRepository.create({
//         account: acc,
//         debit: await this.getAccountBalance(acc.id),
//         credit: 0,
//       }),
//     );
//   }

//   // إقفال المصروفات: تحويلها إلى Income Summary
//   for (const acc of expenseAccounts) {
//     closingEntry.entries.push(
//       this.journalEntryLineRepository.create({
//         account: acc,
//         debit: 0,
//         credit: await this.getAccountBalance(acc.id),
//       }),
//     );
//   }

//   // قيد تحويل صافي الربح/الخسارة إلى Retained Earnings
//   if (netIncome > 0) {
//     // ربح
//     closingEntry.entries.push(
//       this.journalEntryLineRepository.create({
//         account: incomeSummary,
//         debit: netIncome,
//         credit: 0,
//       }),
//       this.journalEntryLineRepository.create({
//         account: retainedEarnings,
//         debit: 0,
//         credit: netIncome,
//       }),
//     );
//   } else if (netIncome < 0) {
//     // خسارة
//     closingEntry.entries.push(
//       this.journalEntryLineRepository.create({
//         account: retainedEarnings,
//         debit: Math.abs(netIncome),
//         credit: 0,
//       }),
//       this.journalEntryLineRepository.create({
//         account: incomeSummary,
//         debit: 0,
//         credit: Math.abs(netIncome),
//       }),
//     );
//   }

//   await this.journalEntryRepository.save(closingEntry);

//   // 8) قفل السنة الحالية
//   fiscalYear.isClosed = true;
//   await this.fiscalYearRepository.save(fiscalYear);

//   // 9) فتح سنة جديدة
//   const newFiscalYear = this.fiscalYearRepository.create({
//     year: fiscalYear.year + 1,
//     isClosed: false,
//   });
//   await this.fiscalYearRepository.save(newFiscalYear);

//   return {
//     message: `Fiscal year ${fiscalYear.year} closed successfully. Net income: ${netIncome}`,
//     newFiscalYear,
//   };
// }


// async closeYear(year: number, userId: string): Promise<void> {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year },
//     relations: ['journalEntries', 'journalEntries.entries'],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${year} not found`);
//   }

//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${year} is already closed`);
//   }

//   // 1. هات كل الحسابات
//   const accounts = await this.accountRepository.find();

//   // 2. هات التاريخ (آخر يوم في السنة)
//   const closingDate = new Date(`${year}-12-31`);

//   // 3. احسب sequenceNumber للشهر (ديسمبر هنا)
//   const month = closingDate.getMonth() + 1; // (1-12)
//   const existingEntries = await this.journalEntryRepository
//     .createQueryBuilder('entry')
//     .where('EXTRACT(MONTH FROM entry.date) = :month', { month })
//     .andWhere('EXTRACT(YEAR FROM entry.date) = :year', { year })
//     .orderBy('entry.sequenceNumber', 'DESC')
//     .getOne();

//   const nextSequenceNumber = existingEntries ? existingEntries.sequenceNumber + 1 : 1;

//   // 4. أنشئ قيد إقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: closingDate,
//     description: `Closing entries for Fiscal Year ${year}`,
//     sequenceNumber: nextSequenceNumber, // 👈 هنا الرقم داخل الشهر
//     fiscalYear,
//   createdBy: { id: userId } as unknown as DeepPartial<UserEntity>,
//   });

//   closingEntry.entries = [];

//   // 5. قفل كل الحسابات المؤقتة (إيرادات ومصروفات)
//   for (const acc of accounts) {
//     if (acc.type === AccountType.Revenue || acc.type === AccountType.Expense) {
//       const balance = await this.getAccountBalance(acc.id);

//       if (balance !== 0) {
//         closingEntry.entries.push(
//           this.journalEntryLineRepository.create({
//             account: acc,
//             debit: balance > 0 ? balance : 0,
//             credit: balance < 0 ? -balance : 0,
//           }),
//         );
//       }
//     }
//   }

//   // 6. احفظ القيد
//   await this.journalEntryRepository.save(closingEntry);

//   // 7. علم السنة إنها اتقفلت
//   fiscalYear.isClosed = true;
//   await this.fiscalYearRepository.save(fiscalYear);
// }


// async closeYear(year: number, userId: string) {
//   // 1. تأكد إن السنة المالية موجودة
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year },
//   });
//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${year} not found`);
//   }

//   // 2. تاريخ الإقفال = آخر يوم في السنة
//   const closingDate = new Date(year, 11, 31);

//   // 3. هات آخر sequenceNumber للشهر (داخل ديسمبر هنا)
//   const lastEntryForMonth = await this.journalEntryRepository.findOne({
//     where: {
//       fiscalYear: { id: fiscalYear.id },
//       date: Between(new Date(year, 11, 1), closingDate),
//     },
//     order: { sequenceNumber: 'DESC' },
//   });

//   const nextSequenceNumber = lastEntryForMonth
//     ? lastEntryForMonth.sequenceNumber + 1
//     : 1;

//   // 4. الشهر (0-based → +1)
//   const month = closingDate.getMonth() + 1;

//   // 5. توليد الكود: year-month-sequence
//   const code = `${year}-${month}-${nextSequenceNumber}`;

//   // 6. إنشاء قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: closingDate,
//     description: `Closing entries for Fiscal Year ${year}`,
//     sequenceNumber: nextSequenceNumber,
//     code,
//     fiscalYear,
//     createdBy: { id: userId } as any, // 👈 عشان يحل مشكلة الـ type
//   });

//   // 7. احفظ القيد
//   await this.journalEntryRepository.save(closingEntry);

//   // 8. عدل حالة السنة المالية إلى مقفولة
//   fiscalYear.isClosed = true;
//   fiscalYear.closedAt = new Date();
//   fiscalYear.closedBy = userId;
//   await this.fiscalYearRepository.save(fiscalYear);

//   return closingEntry;
// }


// async closeYear(year: number, userId: string): Promise<void> {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year },
//     relations: ['journalEntries', 'journalEntries.entries'],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${year} not found`);
//   }
//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${year} is already closed`);
//   }

//   // 1. حساب أرصدة الحسابات المؤقتة
//   const tempAccounts = ['Revenue', 'Expense'];
//   const accountBalances = new Map<number, number>();

// for (const entry of fiscalYear.journalEntries) {
//   for (const line of entry.entries) {
//     if (tempAccounts.includes(line.account.type)) {
//       const prev = accountBalances.get(line.account.id) || 0;
//       accountBalances.set(line.account.id, prev + line.debit - line.credit);
//     }
//   }
// }

//   // 2. جهز تاريخ الإقفال
//   const closingDate = new Date(year, 11, 31); // آخر يوم في السنة

//   // 3. هات آخر sequenceNumber في نفس الشهر
//   const lastEntry = await this.journalEntryRepository.findOne({
//     where: {
//       date: Between(
//         new Date(closingDate.getFullYear(), closingDate.getMonth(), 1),
//         new Date(closingDate.getFullYear(), closingDate.getMonth() + 1, 0),
//       ),
//     },
//     order: { sequenceNumber: 'DESC' },
//   });

//   const nextSequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

//   // 4. أنشئ قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: closingDate,
//     description: `Closing entries for Fiscal Year ${year}`,
//     sequenceNumber: nextSequenceNumber,
//     code: `${closingDate.getFullYear()}-${closingDate.getMonth() + 1}-${nextSequenceNumber}`,
//     fiscalYear,
//     createdBy: { id: userId } as any, // 👈 relation مع UserEntity
//   });

//   // 5. أضف القيود (lines)
//   closingEntry.entries = [];
//   for (const [accountId, balance] of accountBalances) {
//     if (balance !== 0) {
//       closingEntry.entries.push(
//         this.journalEntryLineRepository.create({
//           account: { id: accountId } as any,
//           debit: balance < 0 ? -balance : 0,
//           credit: balance > 0 ? balance : 0,
//         }),
//       );
//     }
//   }

//   await this.journalEntryRepository.save(closingEntry);

//   // 6. حدث حالة السنة المالية
//   fiscalYear.isClosed = true;
//   fiscalYear.closedAt = new Date();
//   fiscalYear.closedBy = { id: userId } as any; // 👈 relation مع UserEntity

//   await this.fiscalYearRepository.save(fiscalYear);
// }


// async closeYear(year: number, userId: string): Promise<void> {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year },
//     relations: ['journalEntries', 'journalEntries.entries'],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${year} not found`);
//   }
//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${year} is already closed`);
//   }

//   // 1. حساب أرصدة الحسابات المؤقتة
//   const tempAccounts = ['Revenue', 'Expense'];
//   const accountBalances = new Map<number, number>();

//   for (const entry of fiscalYear.journalEntries) {
//     for (const line of entry.entries) {
//       if (tempAccounts.includes(line.account.type)) {
//         const prev = accountBalances.get(line.account.id) || 0;
//         accountBalances.set(line.account.id, prev + line.debit - line.credit);
//       }
//     }
//   }

//   // 2. جهز تاريخ الإقفال
//   const closingDate = new Date(year, 11, 31); // آخر يوم في السنة

//   // 3. هات آخر sequenceNumber في نفس الشهر
//   const lastEntry = await this.journalEntryRepository.findOne({
//     where: {
//       date: Between(
//         new Date(closingDate.getFullYear(), closingDate.getMonth(), 1),
//         new Date(closingDate.getFullYear(), closingDate.getMonth() + 1, 0),
//       ),
//     },
//     order: { sequenceNumber: 'DESC' },
//   });

//   const nextSequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

//   // 4. أنشئ قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: closingDate,
//     description: `Closing entries for Fiscal Year ${year}`,
//     sequenceNumber: nextSequenceNumber,
//     code: `${closingDate.getFullYear()}-${closingDate.getMonth() + 1}-${nextSequenceNumber}`,
//     fiscalYear,
//     createdBy: { id: userId } as any,
//     isClosing: true, // ✅ علامة إنه قيد إقفال
//   });

//   // 5. أضف القيود (lines)
//   closingEntry.entries = [];
//   for (const [accountId, balance] of accountBalances) {
//     if (balance !== 0) {
//       closingEntry.entries.push(
//         this.journalEntryLineRepository.create({
//           account: { id: accountId } as any,
//           debit: balance < 0 ? -balance : 0,
//           credit: balance > 0 ? balance : 0,
//         }),
//       );
//     }
//   }

//   await this.journalEntryRepository.save(closingEntry);

//   // 6. حدث حالة السنة المالية
//   fiscalYear.isClosed = true;
//   fiscalYear.closedAt = new Date();
//   fiscalYear.closedBy = { id: userId } as any; // 👈 دلوقتي relation مع UserEntity

//   await this.fiscalYearRepository.save(fiscalYear);
// }


// async closeYear(year: number, userId: string): Promise<void> {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year },
//     relations: ['journalEntries', 'journalEntries.entries'],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${year} not found`);
//   }
//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${year} is already closed`);
//   }

//   // 1️⃣ حساب أرصدة الحسابات المؤقتة
//   const tempAccounts = ['Revenue', 'Expense'];
//   const accountBalances = new Map<number, number>();

//   for (const entry of fiscalYear.journalEntries) {
//     for (const line of entry.entries) {
//       if (tempAccounts.includes(line.account.type)) {
//         const prev = accountBalances.get(line.account.id) || 0;
//         accountBalances.set(
//           line.account.id,
//           prev + Number(line.debit) - Number(line.credit),
//         );
//       }
//     }
//   }

//   // 2️⃣ جهز تاريخ الإقفال
//   const closingDate = new Date(year, 11, 31); // آخر يوم في السنة

//   // 3️⃣ هات آخر sequenceNumber في نفس الشهر
//   const lastEntry = await this.journalEntryRepository.findOne({
//     where: {
//       date: Between(
//         new Date(closingDate.getFullYear(), closingDate.getMonth(), 1),
//         new Date(closingDate.getFullYear(), closingDate.getMonth() + 1, 0),
//       ),
//     },
//     order: { sequenceNumber: 'DESC' },
//   });

//   const nextSequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

//   // 4️⃣ تأكد من وجود حساب Income Summary
//   const incomeSummary = await this.accountRepository.findOne({
//     where: { name: 'Income Summary' },
//   });
//   if (!incomeSummary) {
//     throw new NotFoundException(
//       'Income Summary account not found, please create it first',
//     );
//   }

//   // 5️⃣ أنشئ قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: closingDate,
//     description: `Closing entries for Fiscal Year ${year}`,
//     sequenceNumber: nextSequenceNumber,
//     code: `${closingDate.getFullYear()}-${closingDate.getMonth() + 1}-${nextSequenceNumber}`,
//     fiscalYear,
//     createdBy: { id: userId } as any, // relation مع UserEntity
//     isClosing: true, // ✅ علمه إنه قيد إقفال
//   });

//   closingEntry.entries = [];

//   // 6️⃣ أضف قيود الإقفال لكل حساب مؤقت
//   let totalBalance = 0;
//   for (const [accountId, balance] of accountBalances) {
//     if (balance !== 0) {
//       totalBalance += balance;
//       closingEntry.entries.push(
//         this.journalEntryLineRepository.create({
//           account: { id: accountId } as any,
//           debit: balance < 0 ? -balance : 0,
//           credit: balance > 0 ? balance : 0,
//         }),
//       );
//     }
//   }

//   // 7️⃣ أضف الطرف المقابل (Income Summary)
//   if (totalBalance !== 0) {
//     closingEntry.entries.push(
//       this.journalEntryLineRepository.create({
//         account: { id: incomeSummary.id } as any,
//         debit: totalBalance > 0 ? totalBalance : 0,
//         credit: totalBalance < 0 ? -totalBalance : 0,
//       }),
//     );
//   }

//   await this.journalEntryRepository.save(closingEntry);

//   // 8️⃣ حدث حالة السنة المالية
//   fiscalYear.isClosed = true;
//   fiscalYear.closedAt = new Date();
//   fiscalYear.closedBy = { id: userId } as any;

//   await this.fiscalYearRepository.save(fiscalYear);
// }

// async closeYear(fiscalYearId: number, userId: number) {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year: fiscalYearId },
//     relations: ["journalEntries", "journalEntries.entries", "journalEntries.entries.account"],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${fiscalYearId} not found`);
//   }

//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${fiscalYearId} is already closed`);
//   }

//   const user = await this.userRepositry.findOneBy({ id: userId });
//   if (!user) throw new NotFoundException(`User ${userId} not found`);

//   const incomeSummary = await this.accountRepository.findOne({
//     where: { name: "Income Summary" },
//   });

//   if (!incomeSummary) {
//     throw new NotFoundException("Income Summary account not found");
//   }

//   // اجمع أرصدة الحسابات المؤقتة
//   const accountBalances = new Map<number, number>();
//   const tempAccounts: AccountType[] = [AccountType.Revenue, AccountType.Expense];

//   for (const entry of fiscalYear.journalEntries) {
//     for (const line of entry.entries) {
//       if (tempAccounts.includes(line.account.type)) {
//         const prev = accountBalances.get(line.account.id) || 0;
//         accountBalances.set(line.account.id, prev + Number(line.debit) - Number(line.credit));
//       }
//     }
//   }

//   // اعمل قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//   date: new Date(fiscalYear.year, 11, 31), 
//     description: `Closing entries for Fiscal Year ${fiscalYear.year}`,
//     sequenceNumber: 1,
//     code: `${fiscalYear.year}-12-1`,
//     isClosing: true,
//     createdBy: user,
//     fiscalYear,
//     entries: [],
//   });

//   const lines: JournalEntryLineEntity[] = [];

// // 2) لبساطة نقرأ حسابات المصدر اذا احتجت بيانات اضافية
// for (const [accountId, balanceValue] of accountBalances) {
//   const balance = Number(balanceValue);
//   if (!balance) continue; // skip zero

//   // optional: جلب الحساب الكامل من DB (لو محتاج معلومات اضافية)
//   const account = await this.accountRepository.findOne({ where: { id: accountId } });
//   if (!account) {
//     // ممكن ترمي خطأ او تكمل حسب منطقك
//     continue;
//   }

//   if (balance > 0) {
//     // حساب له رصيد دائن -> نعمل سطر دائن للحساب وسطر مدين لـ incomeSummary
//     lines.push(
//       this.journalEntryLineRepository.create({
//         account: { id: account.id } as any,
//         debit: 0,
//         credit: balance,
//         journalEntry: closingEntry,
//       }),
//     );

//     lines.push(
//       this.journalEntryLineRepository.create({
//         account: { id: incomeSummary.id } as any,
//         debit: balance,
//         credit: 0,
//         journalEntry: closingEntry,
//       }),
//     );
//   } else {
//     const abs = Math.abs(balance);
//     // رصيد مدين -> سطر مدين للحساب و سطر دائن لـ incomeSummary
//     lines.push(
//       this.journalEntryLineRepository.create({
//         account: { id: account.id } as any,
//         debit: abs,
//         credit: 0,
//         journalEntry: closingEntry,
//       }),
//     );

//     lines.push(
//       this.journalEntryLineRepository.create({
//         account: { id: incomeSummary.id } as any,
//         debit: 0,
//         credit: abs,
//         journalEntry: closingEntry,
//       }),
//     );
//   }
// }

// // اسند الأسطر للقيد قبل الحفظ
// closingEntry.entries = lines;

// // احفظ القيد (سوف يحفظ الأسطر لأن relation cascade: true عندك)
// await this.journalEntryRepository.save(closingEntry);

  
//   // اربط الـ lines بالقيد
//   // const lines = [];
//   // for (const [accountId, balance] of accountBalances.entries()) {
//   //   const account = await this.accountRepository.findOneBy({ id: accountId });
//   //   if (!account) continue;

//   //   if (balance > 0) {
//   //     lines.push(
//   //       this.journalEntryLineRepository.create({
//   //         account,
//   //         debit: 0,
//   //         credit: balance,
//   //         journalEntry: closingEntry,
//   //       }),
//   //     );
//   //     lines.push(
//   //       this.journalEntryLineRepository.create({
//   //         account: incomeSummary,
//   //         debit: balance,
//   //         credit: 0,
//   //         journalEntry: closingEntry,
//   //       }),
//   //     );
//   //   } else if (balance < 0) {
//   //     lines.push(
//   //       this.journalEntryLineRepository.create({
//   //         account,
//   //         debit: -balance,
//   //         credit: 0,
//   //         journalEntry: closingEntry,
//   //       }),
//   //     );
//   //     lines.push(
//   //       this.journalEntryLineRepository.create({
//   //         account: incomeSummary,
//   //         debit: 0,
//   //         credit: -balance,
//   //         journalEntry: closingEntry,
//   //       }),
//   //     );
//   //   }
//   // }

//   // closingEntry.entries = lines;

//   // await this.journalEntryRepository.save(closingEntry);

//   // fiscalYear.isClosed = true;
//   // fiscalYear.closedBy = user;
//   // await this.fiscalYearRepository.save(fiscalYear);

//   return closingEntry;
// }



// async closeYear(fiscalYearId: number, userId: number) {
//   const fiscalYear = await this.fiscalYearRepository.findOne({
//     where: { year: fiscalYearId },
//     relations: [
//       "journalEntries",
//       "journalEntries.entries",
//       "journalEntries.entries.account",
//     ],
//   });

//   if (!fiscalYear) {
//     throw new NotFoundException(`Fiscal year ${fiscalYearId} not found`);
//   }

//   if (fiscalYear.isClosed) {
//     throw new BadRequestException(`Fiscal year ${fiscalYearId} is already closed`);
//   }

//   const user = await this.userRepositry.findOneBy({ id: userId });
//   if (!user) throw new NotFoundException(`User ${userId} not found`);

//   const incomeSummary = await this.accountRepository.findOne({
//     where: { name: "Income Summary" },
//   });
//   if (!incomeSummary) {
//     throw new NotFoundException("Income Summary account not found");
//   }

//   // 🟢 حساب أرصدة الحسابات المؤقتة
//   const accountBalances = new Map<number, number>();
//   const tempAccounts: AccountType[] = [AccountType.Revenue, AccountType.Expense];

//   for (const entry of fiscalYear.journalEntries) {
//     for (const line of entry.entries) {
//       if (tempAccounts.includes(line.account.type)) {
//         const prev = accountBalances.get(line.account.id) || 0;
//         accountBalances.set(
//           line.account.id,
//           prev + Number(line.debit) - Number(line.credit),
//         );
//       }
//     }
//   }

//   // 🟢 احسب sequenceNumber الأخير في ديسمبر
//   const startOfDecember = new Date(fiscalYear.year, 11, 1);
//   const endOfDecember = new Date(fiscalYear.year, 11, 31);

//   const lastEntry = await this.journalEntryRepository
//     .createQueryBuilder("entry")
//     .where("entry.date BETWEEN :start AND :end", {
//       start: startOfDecember,
//       end: endOfDecember,
//     })
//     .orderBy("entry.sequenceNumber", "DESC")
//     .getOne();

//   const nextSequenceNumber = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

//   // 🟢 جهز قيد الإقفال
//   const closingEntry = this.journalEntryRepository.create({
//     date: new Date(fiscalYear.year, 11, 31), // 31 ديسمبر
//     description: `Closing entries for Fiscal Year ${fiscalYear.year}`,
//     sequenceNumber: nextSequenceNumber,
//     code: `${fiscalYear.year}-12-${nextSequenceNumber}`,
//     isClosing: true,
//     createdBy: user,
//     fiscalYear,
//     entries: [],
//   });

//   const lines: JournalEntryLineEntity[] = [];

//   // 🟢 أنشئ الأسطر
//   for (const [accountId, balanceValue] of accountBalances) {
//     const balance = Number(balanceValue);
//     if (!balance) continue;

//     const account = await this.accountRepository.findOne({
//       where: { id: accountId },
//     });
//     if (!account) continue;

//     if (balance > 0) {
//       // رصيد دائن
//       lines.push({
//         account,
//         debit: 0,
//         credit: balance,
//       } as JournalEntryLineEntity);

//       lines.push({
//         account: incomeSummary,
//         debit: balance,
//         credit: 0,
//       } as JournalEntryLineEntity);
//     } else {
//       const abs = Math.abs(balance);
//       // رصيد مدين
//       lines.push({
//         account,
//         debit: abs,
//         credit: 0,
//       } as JournalEntryLineEntity);

//       lines.push({
//         account: incomeSummary,
//         debit: 0,
//         credit: abs,
//       } as JournalEntryLineEntity);
//     }
//   }

//   // 🟢 اربط الأسطر بالقيد
//   closingEntry.entries = lines;

//   // 🟢 احفظ القيد والأسطر (Cascade)
//   await this.journalEntryRepository.save(closingEntry);

//   // 🟢 حدث السنة المالية
//   fiscalYear.isClosed = true;
//   fiscalYear.closedBy = user;
//   await this.fiscalYearRepository.save(fiscalYear);

//   return closingEntry;
// }



// method inside FiscalYearService
// async closeYear(year: number, userId: number | string) {
//   return await this.dataSource.transaction(async (manager) => {
//     // 1) جلب السنة المالية
//     const fiscalYearRepo = manager.getRepository(FiscalYearEntity);
//     const fiscalYear = await fiscalYearRepo.findOne({ where: { year } });
//     if (!fiscalYear) throw new NotFoundException(`Fiscal year ${year} not found`);
//     if (fiscalYear.isClosed) throw new BadRequestException(`Fiscal year ${year} is already closed`);

//     // 2) تواريخ السنة
//     const start = new Date(year, 0, 1);
//     const end = new Date(year, 11, 31);

//     // 3) اجمع أرصدة الحسابات المؤقتة (Revenue, Expense) باستخدام تجميع على journal_entry_lines
//     const lineQB = manager.getRepository(JournalEntryLineEntity).createQueryBuilder('line')
//       .leftJoin('line.journalEntry', 'je')
//       .leftJoin('line.account', 'account')
//       .select('account.id', 'accountId')
//       .addSelect('account.type', 'accountType')
//       .addSelect('SUM(line.debit)::numeric', 'sumDebit')
//       .addSelect('SUM(line.credit)::numeric', 'sumCredit')
//       .where('je.date BETWEEN :start AND :end', { start, end })
//       .andWhere('account.type IN (:...types)', { types: [AccountType.Revenue, AccountType.Expense] })
//       .groupBy('account.id')
//       .addGroupBy('account.type');

//     const aggregated: Array<{ accountId: string; accountType: string; sumDebit: string; sumCredit: string; }> =
//       await lineQB.getRawMany();

//     // 4) تأكد أو انشئ حسابات Income Summary و Retained Earnings
//     const accountRepo = manager.getRepository(AccountEntity);

//     let incomeSummary = await accountRepo.findOne({
//       where: [{ name: 'Income Summary' }, { name: 'income_summary' }],
//     });

//     if (!incomeSummary) {
//       incomeSummary = accountRepo.create({
//         name: 'Income Summary',
//         type: AccountType.Equity,
//         accountCode: `9999.${year}`, // مثال كود افتراضي
//         isMain: false,
//         isSub: true,
//       });
//       incomeSummary = await accountRepo.save(incomeSummary);
//     }

//     let retainedEarnings = await accountRepo.findOne({
//       where: [{ name: 'Retained Earnings' }, { name: 'retained_earnings' }],
//     });

//     if (!retainedEarnings) {
//       retainedEarnings = accountRepo.create({
//         name: 'Retained Earnings',
//         type: AccountType.Equity,
//         accountCode: `3000.${year}`, // مثال كود افتراضي
//         isMain: false,
//         isSub: true,
//       });
//       retainedEarnings = await accountRepo.save(retainedEarnings);
//     }

//     // 5) جهز أسطر قيد الإقفال حسب قواعد المحاسبة:
//     //    - نغلق حسابات Revenue بدينها (debit) ونقيم credit على Income Summary
//     //    - نغلق حسابات Expense بدينها على Income Summary (debit) ونقيم credit على Expense
//     const linesToCreate: JournalEntryLineEntity[] = [];
//     let totalRevenue = 0;
//     let totalExpense = 0;

//     for (const row of aggregated) {
//       const accId = Number(row.accountId);
//       const sumDebit = Number(row.sumDebit || 0);
//       const sumCredit = Number(row.sumCredit || 0);
//       const accType = row.accountType as AccountType;

//       if (accType === AccountType.Revenue) {
//         const revBalance = sumCredit - sumDebit; // positive => net credit
//         if (revBalance > 0) {
//           totalRevenue += revBalance;
//           // debit the revenue account to zero it
//           linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: accId } as any,
//             debit: revBalance,
//             credit: 0,
//           }));
//           // credit income summary
//           linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: incomeSummary.id } as any,
//             debit: 0,
//             credit: revBalance,
//           }));
//         }
//       } else if (accType === AccountType.Expense) {
//         const expBalance = sumDebit - sumCredit; // positive => net debit
//         if (expBalance > 0) {
//           totalExpense += expBalance;
//           // debit income summary
//           linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: incomeSummary.id } as any,
//             debit: expBalance,
//             credit: 0,
//           }));
//           // credit the expense account to zero it
//           linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: accId } as any,
//             debit: 0,
//             credit: expBalance,
//           }));
//         }
//       }
//     }

//     // 6) الآن نحسب صافي الربح/الخسارة وننقله لـ Retained Earnings
//     const net = totalRevenue - totalExpense; // >0 => net income (credit to Income Summary)
//     if (net > 0) {
//       // incomeSummary currently has a credit (sum of credits we posted). To transfer to retained earnings:
//       // debit incomeSummary, credit retained earnings
//       linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//         account: { id: incomeSummary.id } as any,
//         debit: net,
//         credit: 0,
//       }));
//       linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//         account: { id: retainedEarnings.id } as any,
//         debit: 0,
//         credit: net,
//       }));
//     } else if (net < 0) {
//       const abs = Math.abs(net);
//       // net loss -> debit retained earnings, credit income summary
//       linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//         account: { id: retainedEarnings.id } as any,
//         debit: abs,
//         credit: 0,
//       }));
//       linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
//         account: { id: incomeSummary.id } as any,
//         debit: 0,
//         credit: abs,
//       }));
//     }
//     // إذا net == 0 فلا نقل

//     // 7) احسب next sequenceNumber لشهر ديسمبر
//     const startDec = new Date(year, 11, 1);
//     const endDec = new Date(year, 11, 31);
//     const lastDecEntry = await manager.getRepository(JournalEntryEntity)
//       .createQueryBuilder('entry')
//       .where('entry.date BETWEEN :start AND :end', { start: startDec, end: endDec })
//       .orderBy('entry.sequenceNumber', 'DESC')
//       .getOne();

//     const nextSeq = lastDecEntry ? lastDecEntry.sequenceNumber + 1 : 1;

//     // 8) أنشئ قيد الإقفال بنفس أسلوب create() عندك (entries مصنوعة بواسطة journalEntryLineRepository.create)
//     const journalRepo = manager.getRepository(JournalEntryEntity);
//     const closingEntry = journalRepo.create({
//       date: end, // 31 Dec
//       description: `Closing entries for Fiscal Year ${year}`,
//       sequenceNumber: nextSeq,
//       code: `${year}-${end.getMonth() + 1}-${nextSeq}`,
//       isClosing: true, // لو ضفت هذا الحقل في الـ entity
//       createdBy: { id: userId } as any,
//       lastModifiedBy: { id: userId } as any,
//       entries: linesToCreate,
//     });

//     const savedClosing = await journalRepo.save(closingEntry);

//     // 9) حدّث حالة السنة المالية (isClosed, closedAt, closedBy)
//     fiscalYear.isClosed = true;
//     fiscalYear.closedAt = new Date();
//     // closedBy relation -> object with id
//     // إذا عندك closedBy كـ uuid/string بدل relation فمرّر id مباشرة
//     (fiscalYear as any).closedBy = { id: userId } as any;

//     await fiscalYearRepo.save(fiscalYear);

//     // 10) ارجع القيد بعد تحميل العلاقات عشان تتأكّد entries موجودة
//     return await journalRepo.findOne({
//       where: { id: savedClosing.id },
//       relations: ['entries', 'entries.account', 'entries.costCenter', 'createdBy'],
//     });
//   });
// }


async closeYear(year: number, userId: number | string) {
  return await this.dataSource.transaction(async (manager) => {
    // 1) جلب السنة المالية
    const fiscalYearRepo = manager.getRepository(FiscalYearEntity);
    const fiscalYear = await fiscalYearRepo.findOne({ where: { year } });
    if (!fiscalYear) throw new NotFoundException(`Fiscal year ${year} not found`);
    if (fiscalYear.isClosed) throw new BadRequestException(`Fiscal year ${year} is already closed`);

    // 2) تواريخ السنة
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);

    // 3) اجمع أرصدة الحسابات المؤقتة (Revenue, Expense)
    const lineQB = manager.getRepository(JournalEntryLineEntity).createQueryBuilder('line')
      .leftJoin('line.journalEntry', 'je')
      .leftJoin('line.account', 'account')
      .select('account.id', 'accountId')
      .addSelect('account.type', 'accountType')
      .addSelect('SUM(line.debit)::numeric', 'sumDebit')
      .addSelect('SUM(line.credit)::numeric', 'sumCredit')
      .where('je.date BETWEEN :start AND :end', { start, end })
      .andWhere('account.type IN (:...types)', { types: [AccountType.Revenue, AccountType.Expense] })
      .groupBy('account.id')
      .addGroupBy('account.type');

    const aggregated: Array<{ accountId: string; accountType: string; sumDebit: string; sumCredit: string; }> =
      await lineQB.getRawMany();

    // 4) تأكد أو انشئ حسابات Income Summary و Retained Earnings
    const accountRepo = manager.getRepository(AccountEntity);

    let incomeSummary = await accountRepo.findOne({
      where: [{ name: 'Income Summary' }, { name: 'income_summary' }],
    });
    if (!incomeSummary) {
      incomeSummary = await accountRepo.save(accountRepo.create({
        name: 'Income Summary',
        type: AccountType.Equity,
        accountCode: `9999.${year}`,
        isMain: false,
        isSub: true,
      }));
    }

    let retainedEarnings = await accountRepo.findOne({
      where: [{ name: 'Retained Earnings' }, { name: 'retained_earnings' }],
    });
    if (!retainedEarnings) {
      retainedEarnings = await accountRepo.save(accountRepo.create({
        name: 'Retained Earnings',
        type: AccountType.Equity,
        accountCode: `3000.${year}`,
        isMain: false,
        isSub: true,
      }));
    }

    // 5) جهز أسطر قيد الإقفال
    const linesToCreate: JournalEntryLineEntity[] = [];
    let totalRevenue = 0;
    let totalExpense = 0;

    for (const row of aggregated) {
      const accId = Number(row.accountId);
      const sumDebit = Number(row.sumDebit || 0);
      const sumCredit = Number(row.sumCredit || 0);
      const accType = row.accountType as AccountType;

      if (accType === AccountType.Revenue) {
        const revBalance = sumCredit - sumDebit; // موجب = دائن
        if (revBalance !== 0) {
          totalRevenue += revBalance;
          if (revBalance > 0) {
            // إيراد طبيعي: Debit revenue, Credit Income Summary
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: accId } as any,
              debit: revBalance,
              credit: 0,
            }));
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: incomeSummary.id } as any,
              debit: 0,
              credit: revBalance,
            }));
          } else {
            const abs = Math.abs(revBalance);
            // إيراد برصيد مدين (عكسي): Debit Income Summary, Credit Revenue
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: incomeSummary.id } as any,
              debit: abs,
              credit: 0,
            }));
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: accId } as any,
              debit: 0,
              credit: abs,
            }));
          }
        }
      } else if (accType === AccountType.Expense) {
        const expBalance = sumDebit - sumCredit; // موجب = مدين
        if (expBalance !== 0) {
          totalExpense += expBalance;
          if (expBalance > 0) {
            // مصروف طبيعي: Debit Income Summary, Credit Expense
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: incomeSummary.id } as any,
              debit: expBalance,
              credit: 0,
            }));
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: accId } as any,
              debit: 0,
              credit: expBalance,
            }));
          } else {
            const abs = Math.abs(expBalance);
            // مصروف برصيد دائن (عكسي): Debit Expense, Credit Income Summary
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: accId } as any,
              debit: abs,
              credit: 0,
            }));
            linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
              account: { id: incomeSummary.id } as any,
              debit: 0,
              credit: abs,
            }));
          }
        }
      }
    }

    // 6) صافي الربح/الخسارة -> Retained Earnings
    const net = totalRevenue - totalExpense;
    if (net > 0) {
      linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
        account: { id: incomeSummary.id } as any,
        debit: net,
        credit: 0,
      }));
      linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
        account: { id: retainedEarnings.id } as any,
        debit: 0,
        credit: net,
      }));
    } else if (net < 0) {
      const abs = Math.abs(net);
      linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
        account: { id: retainedEarnings.id } as any,
        debit: abs,
        credit: 0,
      }));
      linesToCreate.push(manager.getRepository(JournalEntryLineEntity).create({
        account: { id: incomeSummary.id } as any,
        debit: 0,
        credit: abs,
      }));
    }

    // 7) sequenceNumber لشهر ديسمبر
    const startDec = new Date(year, 11, 1);
    const endDec = new Date(year, 11, 31);
    const lastDecEntry = await manager.getRepository(JournalEntryEntity)
      .createQueryBuilder('entry')
      .where('entry.date BETWEEN :start AND :end', { start: startDec, end: endDec })
      .orderBy('entry.sequenceNumber', 'DESC')
      .getOne();

    const nextSeq = lastDecEntry ? lastDecEntry.sequenceNumber + 1 : 1;

    // 8) أنشئ قيد الإقفال
    const journalRepo = manager.getRepository(JournalEntryEntity);
    const closingEntry = journalRepo.create({
      date: end,
      description: `Closing entries for Fiscal Year ${year}`,
      sequenceNumber: nextSeq,
      code: `${year}-${end.getMonth() + 1}-${nextSeq}`,
      isClosing: true,
      createdBy: { id: userId } as any,
      lastModifiedBy: { id: userId } as any,
      entries: linesToCreate,
    });

    const savedClosing = await journalRepo.save(closingEntry);

    // 9) غلق السنة المالية
    fiscalYear.isClosed = true;
    fiscalYear.closedAt = new Date();
    (fiscalYear as any).closedBy = { id: userId } as any;
    await fiscalYearRepo.save(fiscalYear);

    // 10) رجع القيد مع العلاقات
    return await journalRepo.findOne({
      where: { id: savedClosing.id },
      relations: ['entries', 'entries.account', 'entries.costCenter', 'createdBy'],
    });
  });
}



  // 📌 افتتاح السنة
  async openYear(newYear: number) {
    let fiscalYear = await this.fiscalYearRepository.findOne({ where: { year: newYear } });

    if (fiscalYear && !fiscalYear.isClosed) {
      throw new BadRequestException(`Fiscal year ${newYear} already open`);
    }

    const prevYear = newYear - 1;
    const endPrev = new Date(`${prevYear}-12-31`);

    const accounts = await this.journalEntryRepository
      .createQueryBuilder('entry')
      .leftJoin('entry.entries', 'line')
      .leftJoin('line.account', 'account')
      .select('account.id', 'accountId')
      .addSelect('SUM(line.debit)', 'debit')
      .addSelect('SUM(line.credit)', 'credit')
      .where('entry.date <= :endPrev', { endPrev })
      .groupBy('account.id')
      .getRawMany();

    if (!accounts.length) {
      throw new NotFoundException(`No balances found for year ${prevYear}`);
    }

    // قيد الافتتاح
    const openingEntry = this.journalEntryRepository.create({
      date: new Date(`${newYear}-01-01`),
      description: `Opening entry for year ${newYear}`,
      entries: await Promise.all(
        accounts.map(async (acc) => {
          const account = await this.accountRepository.findOneByOrFail({
            id: acc.accountId,
          });
          const balance = Number(acc.debit) - Number(acc.credit);
          return this.journalEntryLineRepository.create({
            account,
            debit: balance > 0 ? balance : 0,
            credit: balance < 0 ? -balance : 0,
          });
        }),
      ),
    });

    await this.journalEntryRepository.save(openingEntry);

    // نضيف السنة الجديدة لو مش موجودة
    if (!fiscalYear) {
      fiscalYear = this.fiscalYearRepository.create({
        year: newYear,
        isClosed: false,
      });
    } else {
      fiscalYear.isClosed = false;
      fiscalYear.closedAt = null;
      fiscalYear.closedBy = null;
    }

    await this.fiscalYearRepository.save(fiscalYear);

    return { message: 'Opening entry created', newYear };
  }


  /**
 * يحسب رصيد الحساب = SUM(debit) - SUM(credit)
 * @param accountId account id (number|string)
 * @param upTo اختياري: تاريخ أقصى للاحتساب (inclusive)
 */
async getAccountBalance(accountId: number | string, upTo?: Date): Promise<number> {
  // تأكد تحويل accountId لرقم (أو string لو عندك UUIDs)
  const accId = typeof accountId === 'string' && /^\d+$/.test(accountId) ? Number(accountId) : accountId;

  const qb = this.journalEntryLineRepository.createQueryBuilder('line')
    .leftJoin('line.journalEntry', 'je')    // للاطّلاع على تاريخ القيد
    .leftJoin('line.account', 'account')    // للاطّلاع على id الحساب

    // فلترة حسب حساب
    .where('account.id = :accountId', { accountId: accId });

  if (upTo) {
    qb.andWhere('je.date <= :upTo', { upTo });
  }

  const raw = await qb
    .select('COALESCE(SUM(line.debit), 0)', 'debit')
    .addSelect('COALESCE(SUM(line.credit), 0)', 'credit')
    .getRawOne();

  const debit = parseFloat(raw?.debit ?? '0');
  const credit = parseFloat(raw?.credit ?? '0');

  return debit - credit;
}

}
