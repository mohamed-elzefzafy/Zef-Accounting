// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Between, DeepPartial, Repository, DataSource } from 'typeorm';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import {
//   JournalEntryEntity,
//   JournalEntryLineEntity,
// } from 'src/journal-entries/entities/journal-entry.entity';
// import { AccountEntity, AccountType } from 'src/chart/entities/chart.entity';
// import { UserEntity } from 'src/users/entities/user.entity';

// @Injectable()
// export class FiscalYearService {
//   constructor(
//     @InjectRepository(FiscalYearEntity)
//     private readonly fiscalYearRepository: Repository<FiscalYearEntity>,
//     @InjectRepository(JournalEntryEntity)
//     private readonly journalEntryRepository: Repository<JournalEntryEntity>,
//     @InjectRepository(JournalEntryLineEntity)
//     private readonly journalEntryLineRepository: Repository<JournalEntryLineEntity>,
//     @InjectRepository(AccountEntity)
//     private readonly accountRepository: Repository<AccountEntity>,

//     @InjectRepository(UserEntity)
//     private readonly userRepositry: Repository<UserEntity>,
//     private readonly dataSource: DataSource,
//   ) {}

//   async create(dto: CreateFiscalYearDto) {
//     const existing = await this.fiscalYearRepository.findOne({
//       where: { year: dto.year },
//     });
//     if (existing) {
//       throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
//     }

//     const fiscalYear = this.fiscalYearRepository.create({
//       year: dto.year,
//       isClosed: false,
//     });

//     return this.fiscalYearRepository.save(fiscalYear);
//   }

//   async findAll() {
//     return this.fiscalYearRepository.find({ order: { year: 'ASC' } });
//   }

//   async findOne(year: number) {
//     const fiscalYear = await this.fiscalYearRepository.findOne({
//       where: { year },
//     });
//     if (!fiscalYear) {
//       throw new NotFoundException(`Fiscal year ${year} not found`);
//     }
//     return fiscalYear;
//   }

//   async getCurrentYear() {
//     const fiscalYear = await this.fiscalYearRepository.findOne({
//       where: { isClosed: false },
//       order: { year: 'DESC' },
//     });

//     if (!fiscalYear) {
//       throw new NotFoundException('No active fiscal year found');
//     }

//     return fiscalYear;
//   }

//   async closeYear(year: number, userId: number | string) {
//     return await this.dataSource.transaction(async (manager) => {
//       // 1) جلب السنة المالية
//       const fiscalYearRepo = manager.getRepository(FiscalYearEntity);
//       const fiscalYear = await fiscalYearRepo.findOne({ where: { year } });
//       if (!fiscalYear)
//         throw new NotFoundException(`Fiscal year ${year} not found`);
//       if (fiscalYear.isClosed)
//         throw new BadRequestException(`Fiscal year ${year} is already closed`);

//       // 2) تواريخ السنة
//       const start = new Date(year, 0, 1);
//       const end = new Date(year, 11, 31);

//       // 3) اجمع أرصدة الحسابات المؤقتة (Revenue, Expense)
//       const lineQB = manager
//         .getRepository(JournalEntryLineEntity)
//         .createQueryBuilder('line')
//         .leftJoin('line.journalEntry', 'je')
//         .leftJoin('line.account', 'account')
//         .select('account.id', 'accountId')
//         .addSelect('account.type', 'accountType')
//         .addSelect('SUM(line.debit)::numeric', 'sumDebit')
//         .addSelect('SUM(line.credit)::numeric', 'sumCredit')
//         .where('je.date BETWEEN :start AND :end', { start, end })
//         .andWhere('account.type IN (:...types)', {
//           types: [AccountType.Revenue, AccountType.Expense],
//         })
//         .groupBy('account.id')
//         .addGroupBy('account.type');

//       const aggregated: Array<{
//         accountId: string;
//         accountType: string;
//         sumDebit: string;
//         sumCredit: string;
//       }> = await lineQB.getRawMany();

//       // 4) تأكد أو انشئ حسابات Income Summary و Retained Earnings
//       const accountRepo = manager.getRepository(AccountEntity);

//       let incomeSummary = await accountRepo.findOne({
//         where: [{ name: 'Income Summary' }, { name: 'income_summary' }],
//       });
//       if (!incomeSummary) {
//         incomeSummary = await accountRepo.save(
//           accountRepo.create({
//             name: 'Income Summary',
//             type: AccountType.Equity,
//             accountCode: `9999.${year}`,
//             isMain: false,
//             isSub: true,
//           }),
//         );
//       }

//       let retainedEarnings = await accountRepo.findOne({
//         where: [{ name: 'Retained Earnings' }, { name: 'retained_earnings' }],
//       });
//       if (!retainedEarnings) {
//         retainedEarnings = await accountRepo.save(
//           accountRepo.create({
//             name: 'Retained Earnings',
//             type: AccountType.Equity,
//             accountCode: `3000.${year}`,
//             isMain: false,
//             isSub: true,
//           }),
//         );
//       }

//       // 5) جهز أسطر قيد الإقفال
//       const linesToCreate: JournalEntryLineEntity[] = [];
//       let totalRevenue = 0;
//       let totalExpense = 0;

//       for (const row of aggregated) {
//         const accId = Number(row.accountId);
//         const sumDebit = Number(row.sumDebit || 0);
//         const sumCredit = Number(row.sumCredit || 0);
//         const accType = row.accountType as AccountType;

//         if (accType === AccountType.Revenue) {
//           const revBalance = sumCredit - sumDebit; // موجب = دائن
//           if (revBalance !== 0) {
//             totalRevenue += revBalance;
//             if (revBalance > 0) {
//               // إيراد طبيعي: Debit revenue, Credit Income Summary
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: accId } as any,
//                   debit: revBalance,
//                   credit: 0,
//                 }),
//               );
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: incomeSummary.id } as any,
//                   debit: 0,
//                   credit: revBalance,
//                 }),
//               );
//             } else {
//               const abs = Math.abs(revBalance);
//               // إيراد برصيد مدين (عكسي): Debit Income Summary, Credit Revenue
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: incomeSummary.id } as any,
//                   debit: abs,
//                   credit: 0,
//                 }),
//               );
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: accId } as any,
//                   debit: 0,
//                   credit: abs,
//                 }),
//               );
//             }
//           }
//         } else if (accType === AccountType.Expense) {
//           const expBalance = sumDebit - sumCredit; // موجب = مدين
//           if (expBalance !== 0) {
//             totalExpense += expBalance;
//             if (expBalance > 0) {
//               // مصروف طبيعي: Debit Income Summary, Credit Expense
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: incomeSummary.id } as any,
//                   debit: expBalance,
//                   credit: 0,
//                 }),
//               );
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: accId } as any,
//                   debit: 0,
//                   credit: expBalance,
//                 }),
//               );
//             } else {
//               const abs = Math.abs(expBalance);
//               // مصروف برصيد دائن (عكسي): Debit Expense, Credit Income Summary
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: accId } as any,
//                   debit: abs,
//                   credit: 0,
//                 }),
//               );
//               linesToCreate.push(
//                 manager.getRepository(JournalEntryLineEntity).create({
//                   account: { id: incomeSummary.id } as any,
//                   debit: 0,
//                   credit: abs,
//                 }),
//               );
//             }
//           }
//         }
//       }

//       // 6) صافي الربح/الخسارة -> Retained Earnings
//       const net = totalRevenue - totalExpense;
//       if (net > 0) {
//         linesToCreate.push(
//           manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: incomeSummary.id } as any,
//             debit: net,
//             credit: 0,
//           }),
//         );
//         linesToCreate.push(
//           manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: retainedEarnings.id } as any,
//             debit: 0,
//             credit: net,
//           }),
//         );
//       } else if (net < 0) {
//         const abs = Math.abs(net);
//         linesToCreate.push(
//           manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: retainedEarnings.id } as any,
//             debit: abs,
//             credit: 0,
//           }),
//         );
//         linesToCreate.push(
//           manager.getRepository(JournalEntryLineEntity).create({
//             account: { id: incomeSummary.id } as any,
//             debit: 0,
//             credit: abs,
//           }),
//         );
//       }

//       // 7) sequenceNumber لشهر ديسمبر
//       const startDec = new Date(year, 11, 1);
//       const endDec = new Date(year, 11, 31);
//       const lastDecEntry = await manager
//         .getRepository(JournalEntryEntity)
//         .createQueryBuilder('entry')
//         .where('entry.date BETWEEN :start AND :end', {
//           start: startDec,
//           end: endDec,
//         })
//         .orderBy('entry.sequenceNumber', 'DESC')
//         .getOne();

//       const nextSeq = lastDecEntry ? lastDecEntry.sequenceNumber + 1 : 1;

//       // 8) أنشئ قيد الإقفال
//       const journalRepo = manager.getRepository(JournalEntryEntity);
//       const closingEntry = journalRepo.create({
//         date: end,
//         description: `Closing entries for Fiscal Year ${year}`,
//         sequenceNumber: nextSeq,
//         code: `${year}-${end.getMonth() + 1}-${nextSeq}`,
//         isClosing: true,
//         createdBy: { id: userId } as any,
//         lastModifiedBy: { id: userId } as any,
//         lines: linesToCreate,
//       });

//       const savedClosing = await journalRepo.save(closingEntry);

//       // 9) غلق السنة المالية
//       fiscalYear.isClosed = true;
//       fiscalYear.closedAt = new Date();
//       (fiscalYear as any).closedBy = { id: userId } as any;
//       await fiscalYearRepo.save(fiscalYear);

//       // 10) رجع القيد مع العلاقات
//       return await journalRepo.findOne({
//         where: { id: savedClosing.id },
//         relations: [
//           'entries',
//           'entries.account',
//           'entries.costCenter',
//           'createdBy',
//         ],
//       });
//     });
//   }

//   async openYear(newYear: number) {
//     let fiscalYear = await this.fiscalYearRepository.findOne({
//       where: { year: newYear },
//     });

//     if (fiscalYear && fiscalYear.isClosed) {
//       throw new BadRequestException(`Fiscal year ${newYear} has been closed`);
//     }

//     const prevYear = newYear - 1;
//     const endPrev = new Date(`${prevYear}-12-31`);

//     const accounts = await this.journalEntryRepository
//       .createQueryBuilder('entry')
//       .leftJoin('entry.lines', 'line')
//       .leftJoin('line.account', 'account')
//       .select('account.id', 'accountId')
//       .addSelect('SUM(line.debit)', 'debit')
//       .addSelect('SUM(line.credit)', 'credit')
//       .where('entry.date <= :endPrev', { endPrev })
//       .groupBy('account.id')
//       .getRawMany();

//     if (!accounts.length) {
//       throw new NotFoundException(`No balances found for year ${prevYear}`);
//     }

//     // 👇 sequence رقم 1 في شهر يناير
//     const seq = 1;
//     const code = `${newYear}-1-${seq}`;

//     // ✅ قيد الافتتاح (مع تجاهل الحسابات برصيد صفر)
//     const openingEntry = this.journalEntryRepository.create({
//       date: new Date(`${newYear}-01-01`),
//       description: `Opening entry for year ${newYear}`,
//       sequenceNumber: seq,
//       code,
//       //   entries: await Promise.all(
//       //     accounts
//       //       .map(async (acc) => {
//       //         const balance = Number(acc.debit) - Number(acc.credit);
//       //         if (balance === 0) {
//       //           return null; // تجاهل الحساب برصيد صفر
//       //         }
//       //         const account = await this.accountRepository.findOneByOrFail({
//       //           id: acc.accountId,
//       //         });
//       //         return this.journalEntryLineRepository.create({
//       //           account,
//       //           debit: balance > 0 ? balance : 0,
//       //           credit: balance < 0 ? -balance : 0,
//       //         });
//       //       })
//       //   ).then((lines) => lines.filter((line) => line !== null)), // فلترة null
//       lines: await Promise.all(
//         accounts.map(async (acc) => {
//           const balance = Number(acc.debit) - Number(acc.credit);
//           if (balance === 0) {
//             return null;
//           }
//           const account = await this.accountRepository.findOneByOrFail({
//             id: acc.accountId,
//           });
//           return this.journalEntryLineRepository.create({
//             account,
//             debit: balance > 0 ? balance : 0,
//             credit: balance < 0 ? -balance : 0,
//           });
//         }),
//       ).then((lines) => lines.filter((line) => line !== null)),
//     });

//     await this.journalEntryRepository.save(openingEntry);

//     // ✅ نضيف السنة الجديدة أو نعيد فتحها
//     if (!fiscalYear) {
//       fiscalYear = this.fiscalYearRepository.create({
//         year: newYear,
//         isClosed: false,
//       });
//     } else {
//       fiscalYear.isClosed = false;
//       fiscalYear.closedAt = null;
//       fiscalYear.closedBy = null;
//     }

//     await this.fiscalYearRepository.save(fiscalYear);

//     return { message: 'Opening entry created', newYear, code };
//   }

//   /**
//    * يحسب رصيد الحساب = SUM(debit) - SUM(credit)
//    * @param accountId account id (number|string)
//    * @param upTo اختياري: تاريخ أقصى للاحتساب (inclusive)
//    */
//   async getAccountBalance(
//     accountId: number | string,
//     upTo?: Date,
//   ): Promise<number> {
//     // تأكد تحويل accountId لرقم (أو string لو عندك UUIDs)
//     const accId =
//       typeof accountId === 'string' && /^\d+$/.test(accountId)
//         ? Number(accountId)
//         : accountId;

//     const qb = this.journalEntryLineRepository
//       .createQueryBuilder('line')
//       .leftJoin('line.journalEntry', 'je') // للاطّلاع على تاريخ القيد
//       .leftJoin('line.account', 'account') // للاطّلاع على id الحساب

//       // فلترة حسب حساب
//       .where('account.id = :accountId', { accountId: accId });

//     if (upTo) {
//       qb.andWhere('je.date <= :upTo', { upTo });
//     }

//     const raw = await qb
//       .select('COALESCE(SUM(line.debit), 0)', 'debit')
//       .addSelect('COALESCE(SUM(line.credit), 0)', 'credit')
//       .getRawOne();

//     const debit = parseFloat(raw?.debit ?? '0');
//     const credit = parseFloat(raw?.credit ?? '0');

//     return debit - credit;
//   }
// }




import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FiscalYearEntity } from './entities/fiscal-year.entity';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from 'src/journal-entries/entities/journal-entry.entity';
import { AccountEntity, AccountType } from 'src/chart/entities/chart.entity';

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

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateFiscalYearDto) {
    const exists = await this.fiscalYearRepository.findOne({
      where: { year: dto.year },
    });

    if (exists) {
      throw new BadRequestException('Year already exists');
    }

    const fy = this.fiscalYearRepository.create({
      year: dto.year,
      isClosed: false,
    });

    return this.fiscalYearRepository.save(fy);
  }

  async findAll() {
    return this.fiscalYearRepository.find({ order: { year: 'ASC' } });
  }

  async findOne(year: number) {
    const fy = await this.fiscalYearRepository.findOne({
      where: { year },
    });

    if (!fy) throw new NotFoundException('Year not found');

    return fy;
  }

  async getCurrentYear() {
    const fy = await this.fiscalYearRepository.findOne({
      where: { isClosed: false },
      order: { year: 'DESC' },
    });

    if (!fy) throw new NotFoundException('No active year');

    return fy;
  }

  // ===============================
  // ✅ CLOSE YEAR
  // ===============================
  async closeYear(year: number, userId: number | string) {
    return this.dataSource.transaction(async (manager) => {
      const fyRepo = manager.getRepository(FiscalYearEntity);

      const fy = await fyRepo.findOne({ where: { year } });

      if (!fy) throw new NotFoundException('Year not found');

      if (fy.isClosed)
        throw new BadRequestException('Year already closed');

      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);

      const aggregated = await manager
        .getRepository(JournalEntryLineEntity)
        .createQueryBuilder('line')
        .leftJoin('line.journalEntry', 'je')
        .leftJoin('line.account', 'account')
        .select('account.id', 'accountId')
        .addSelect('account.type', 'accountType')
        .addSelect('SUM(line.debit)', 'debit')
        .addSelect('SUM(line.credit)', 'credit')
        .where('je.date BETWEEN :start AND :end', { start, end })
        .andWhere('account.type IN (:...types)', {
          types: [AccountType.Revenue, AccountType.Expense],
        })
        .groupBy('account.id')
        .addGroupBy('account.type')
        .getRawMany();

      const accountRepo = manager.getRepository(AccountEntity);

      let incomeSummary = await accountRepo.findOne({
        where: { name: 'Income Summary' },
      });

      if (!incomeSummary) {
        incomeSummary = await accountRepo.save(
          accountRepo.create({
            name: 'Income Summary',
            type: AccountType.Equity,
          }),
        );
      }

      let retained = await accountRepo.findOne({
        where: { name: 'Retained Earnings' },
      });

      if (!retained) {
        retained = await accountRepo.save(
          accountRepo.create({
            name: 'Retained Earnings',
            type: AccountType.Equity,
          }),
        );
      }

      const lines: JournalEntryLineEntity[] = [];
      let totalRevenue = 0;
      let totalExpense = 0;

      for (const row of aggregated) {
        const accId = Number(row.accountId);
        const debit = Number(row.debit || 0);
        const credit = Number(row.credit || 0);
        const type = row.accountType as AccountType;

        if (type === AccountType.Revenue) {
          const balance = credit - debit;
          if (balance !== 0) {
            totalRevenue += balance;

            lines.push(
              manager.getRepository(JournalEntryLineEntity).create({
                account: { id: accId } as any,
                debit: balance > 0 ? balance : 0,
                credit: balance < 0 ? -balance : 0,
              }),
              manager.getRepository(JournalEntryLineEntity).create({
                account: { id: incomeSummary.id } as any,
                debit: balance < 0 ? -balance : 0,
                credit: balance > 0 ? balance : 0,
              }),
            );
          }
        }

        if (type === AccountType.Expense) {
          const balance = debit - credit;
          if (balance !== 0) {
            totalExpense += balance;

            lines.push(
              manager.getRepository(JournalEntryLineEntity).create({
                account: { id: accId } as any,
                debit: balance < 0 ? -balance : 0,
                credit: balance > 0 ? balance : 0,
              }),
              manager.getRepository(JournalEntryLineEntity).create({
                account: { id: incomeSummary.id } as any,
                debit: balance > 0 ? balance : 0,
                credit: balance < 0 ? -balance : 0,
              }),
            );
          }
        }
      }

      const net = totalRevenue - totalExpense;

      if (net !== 0) {
        lines.push(
          manager.getRepository(JournalEntryLineEntity).create({
            account: { id: incomeSummary.id } as any,
            debit: net > 0 ? net : 0,
            credit: net < 0 ? -net : 0,
          }),
          manager.getRepository(JournalEntryLineEntity).create({
            account: { id: retained.id } as any,
            debit: net < 0 ? -net : 0,
            credit: net > 0 ? net : 0,
          }),
        );
      }

      const journalRepo = manager.getRepository(JournalEntryEntity);

      await journalRepo.save(
        journalRepo.create({
          date: end,
          description: `Closing ${year}`,
          sequenceNumber: 9999,
          code: `${year}-closing`,
          isClosing: true,
          createdBy: { id: userId } as any,
          lines,
        }),
      );

      fy.isClosed = true;
      fy.closedAt = new Date();
      fy.closedBy = { id: userId } as any;

      await fyRepo.save(fy);

      return { message: `Year ${year} closed` };
    });
  }

  // ===============================
  // ✅ OPEN YEAR
  // ===============================
  async openYear(newYear: number) {
    const prevYear = newYear - 1;

    const prev = await this.fiscalYearRepository.findOne({
      where: { year: prevYear },
    });

    if (!prev) throw new NotFoundException('Previous year not found');

    if (!prev.isClosed)
      throw new BadRequestException('Close previous year first');

    const endPrev = new Date(`${prevYear}-12-31`);

    const accounts = await this.journalEntryRepository
      .createQueryBuilder('entry')
      .leftJoin('entry.lines', 'line')
      .leftJoin('line.account', 'account')
      .select('account.id', 'accountId')
      .addSelect('SUM(line.debit)', 'debit')
      .addSelect('SUM(line.credit)', 'credit')
      .where('entry.date <= :endPrev', { endPrev })
      .andWhere('account.type IN (:...types)', {
        types: [
          AccountType.Asset,
          AccountType.Liability,
          AccountType.Equity,
        ],
      })
      .groupBy('account.id')
      .getRawMany();

    const opening = this.journalEntryRepository.create({
      date: new Date(`${newYear}-01-01`),
      description: `Opening ${newYear}`,
      sequenceNumber: 1,
      code: `[${newYear}]0-0`,
      isOpening: true,
      lines: await Promise.all(
        accounts.map(async (acc) => {
          const balance = Number(acc.debit) - Number(acc.credit);

          if (balance === 0) return null;

          const account = await this.accountRepository.findOneByOrFail({
            id: acc.accountId,
          });

          return this.journalEntryLineRepository.create({
            account,
            debit: balance > 0 ? balance : 0,
            credit: balance < 0 ? -balance : 0,
          });
        }),
      ).then((l) => l.filter((x) => x !== null)),
    });

    await this.journalEntryRepository.save(opening);

    let fy = await this.fiscalYearRepository.findOne({
      where: { year: newYear },
    });

    if (!fy) {
      fy = this.fiscalYearRepository.create({
        year: newYear,
        isClosed: false,
      });
    } else {
      fy.isClosed = false;
      fy.closedAt = null;
      fy.closedBy = null;
    }

    await this.fiscalYearRepository.save(fy);

    return { message: `Opening created for ${newYear}` };
  }
}