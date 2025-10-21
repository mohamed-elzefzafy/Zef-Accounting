import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from '../journal-entries/entities/journal-entry.entity';
import { GetLedgerDto } from './dto/get-ledger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';

export interface LedgerDetail {
  entryNumber: string | number;
  code: string;
  date: Date;
  description: string;
  costCenter: any | null;
  debit: number;
  credit: number;
  balance: number;
}

export interface LedgerResult {
  accountId: number;
  costCenter: string | number | 'All';
  period: { startDate: Date; endDate: Date };
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
  balanceType: 'Debit' | 'Credit' | 'Balanced';
  details: LedgerDetail[];
}

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectRepository(JournalEntryEntity)
    private readonly journalEntryRepository: Repository<JournalEntryEntity>,

    @InjectRepository(JournalEntryLineEntity)
    private readonly journalEntryLineEntity: Repository<JournalEntryLineEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  // async getGeneralLedger(dto: GetLedgerDto): Promise<LedgerResult> {
  //   const { accountId, startDate: startStr, endDate: endStr, costCenter } = dto;

  //   if (!accountId) {
  //     throw new BadRequestException('accountId is required');
  //   }

  //   // normalize dates
  //   const start = startStr ? new Date(startStr) : new Date('1900-01-01');
  //   const end = endStr ? new Date(endStr) : new Date();
  //   end.setHours(23, 59, 59, 999);

  //   // 1) Opening balance: كل الحركات قبل start
  //   const openingQB = this.journalEntryLineEntity.createQueryBuilder('line')
  //     .leftJoin('line.journalEntry', 'je')
  //     .leftJoin('line.account', 'account')
  //     .select('COALESCE(SUM(line.debit),0)', 'sumDebit')
  //     .addSelect('COALESCE(SUM(line.credit),0)', 'sumCredit')
  //     .where('account.id = :accountId', { accountId })
  //     .andWhere('je.date < :start', { start });

  //   if (costCenter) {
  //     openingQB.leftJoin('line.costCenter', 'cc').andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const openingRaw = await openingQB.getRawOne();
  //   const openingDebit = Number(openingRaw?.sumDebit ?? 0);
  //   const openingCredit = Number(openingRaw?.sumCredit ?? 0);
  //   const openingBalance = openingDebit - openingCredit; // مدين موجب، دائن سالب

  //   // 2) جلب القيود داخل الفترة (مع السطور)
  //   const qb = this.journalEntryRepository.createQueryBuilder('je')
  //     .leftJoinAndSelect('je.entries', 'line')
  //     .leftJoinAndSelect('line.account', 'account')
  //     .leftJoinAndSelect('line.costCenter', 'cc')
  //     .where('je.date BETWEEN :start AND :end', { start, end })
  //     .andWhere('account.id = :accountId', { accountId });

  //   if (costCenter) {
  //     qb.andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const journalEntries = await qb
  //     .orderBy('je.date', 'ASC')
  //     .addOrderBy('je.sequenceNumber', 'ASC')
  //     .getMany();

  //   // 3) بناء الـ ledger
  //   const details: LedgerDetail[] = [];
  //   let runningBalance = openingBalance;
  //   let totalDebit = 0;
  //   let totalCredit = 0;

  //   // افتتح صف Opening Balance — وضمّمه فى totals بالطريقة الصحيحة
  //   const openingDebitForTotals = openingBalance > 0 ? openingBalance : 0;
  //   const openingCreditForTotals = openingBalance < 0 ? -openingBalance : 0;

  //   totalDebit += openingDebitForTotals;
  //   totalCredit += openingCreditForTotals;

  //   details.push({
  //     entryNumber: '-',
  //     code: '-',
  //     date: start,
  //     description: 'Opening Balance',
  //     costCenter: null,
  //     debit: openingDebitForTotals,
  //     credit: openingCreditForTotals,
  //     balance: runningBalance,
  //   });

  //   // 4) امشى على كل قيد، وبعدين على كل سطر داخل القيد (هنا تختفي الأخطاء)
  //   for (const je of journalEntries) {
  //     // je.entries يجب أن يكون نوعه JournalEntryLineEntity[]
  //     for (const line of je.entries) {
  //       // تأكد إن السطر تابع للحساب المطلوب (safety)
  //       const lineAccountId =
  //         typeof line.account === 'object' ? (line.account as any).id : Number(line.account);

  //       if (lineAccountId !== accountId) continue;

  //       // تحقق من مركز التكلفة لو مطلوب
  //       if (costCenter) {
  //         const lineCC =
  //           line.costCenter && typeof line.costCenter === 'object'
  //             ? (line.costCenter as any).id
  //             : line.costCenter;
  //         if (lineCC !== costCenter) continue;
  //       }

  //       const debit = Number(line.debit ?? 0);
  //       const credit = Number(line.credit ?? 0);

  //       totalDebit += debit;
  //       totalCredit += credit;
  //       runningBalance += debit - credit;

  //       details.push({
  //         entryNumber: je.sequenceNumber ?? '-',
  //         code: je.code ?? '-',
  //         date: je.date,
  //         description: je.description ?? '',
  //         costCenter: line.costCenter ?? null,
  //         debit,
  //         credit,
  //         balance: runningBalance,
  //       });
  //     }
  //   }

  //   const closingBalance = runningBalance;
  //   const balanceType = closingBalance > 0 ? 'Debit' : closingBalance < 0 ? 'Credit' : 'Balanced';

  //   return {
  //     accountId,
  //     costCenter: costCenter ?? 'All',
  //     period: { startDate: start, endDate: end },
  //     openingBalance,
  //     totalDebit,
  //     totalCredit,
  //     closingBalance,
  //     balanceType,
  //     details,
  //   };
  // }

  // async getGeneralLedger(dto: GetLedgerDto): Promise<LedgerResult> {
  //   const { accountId, startDate: startStr, endDate: endStr, costCenter } = dto;

  //   if (!accountId) {
  //     throw new BadRequestException('accountId is required');
  //   }

  //   // 🟢 1) هات كل الحسابات (الحساب الرئيسى + أولاده)
  //   const rootAccount = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //     relations: ['children'],
  //   });

  //   if (!rootAccount) {
  //     throw new NotFoundException('Account not found');
  //   }

  //   // recursive function تجيب كل IDs
  //   const collectIds = (acc: any): number[] => {
  //     let ids = [acc.id];
  //     if (acc.children?.length) {
  //       for (const child of acc.children) {
  //         ids = ids.concat(collectIds(child));
  //       }
  //     }
  //     return ids;
  //   };

  //   const accountIds = collectIds(rootAccount);

  //   // 🟢 2) تجهيز التواريخ
  //   const start = startStr ? new Date(startStr) : new Date('1900-01-01');
  //   const end = endStr ? new Date(endStr) : new Date();
  //   end.setHours(23, 59, 59, 999);

  //   // 🟢 3) Opening balance
  //   const openingQB = this.journalEntryLineEntity.createQueryBuilder('line')
  //     .leftJoin('line.journalEntry', 'je')
  //     .leftJoin('line.account', 'account')
  //     .select('COALESCE(SUM(line.debit),0)', 'sumDebit')
  //     .addSelect('COALESCE(SUM(line.credit),0)', 'sumCredit')
  //     .where('account.id IN (:...accountIds)', { accountIds })
  //     .andWhere('je.date < :start', { start });

  //   if (costCenter) {
  //     openingQB.leftJoin('line.costCenter', 'cc').andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const openingRaw = await openingQB.getRawOne();
  //   const openingDebit = Number(openingRaw?.sumDebit ?? 0);
  //   const openingCredit = Number(openingRaw?.sumCredit ?? 0);
  //   const openingBalance = openingDebit - openingCredit;

  //   // 🟢 4) جلب القيود فى الفترة
  //   const qb = this.journalEntryRepository.createQueryBuilder('je')
  //     .leftJoinAndSelect('je.lines', 'line')
  //     .leftJoinAndSelect('line.account', 'account')
  //     .leftJoinAndSelect('line.costCenter', 'cc')
  //     .where('je.date BETWEEN :start AND :end', { start, end })
  //     .andWhere('account.id IN (:...accountIds)', { accountIds });

  //   if (costCenter) {
  //     qb.andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const journalEntries = await qb
  //     .orderBy('je.date', 'ASC')
  //     .addOrderBy('je.sequenceNumber', 'ASC')
  //     .getMany();

  //   // 🟢 5) بناء الـ ledger
  //   const details: LedgerDetail[] = [];
  //   let runningBalance = openingBalance;
  //   let totalDebit = 0;
  //   let totalCredit = 0;

  //   // Opening row
  //   const openingDebitForTotals = openingBalance > 0 ? openingBalance : 0;
  //   const openingCreditForTotals = openingBalance < 0 ? -openingBalance : 0;

  //   totalDebit += openingDebitForTotals;
  //   totalCredit += openingCreditForTotals;

  //   details.push({
  //     entryNumber: '-',
  //     code: '-',
  //     date: start,
  //     description: 'Opening Balance',
  //     costCenter: null,
  //     debit: openingDebitForTotals,
  //     credit: openingCreditForTotals,
  //     balance: runningBalance,
  //   });

  //   // Loop على القيود
  //   for (const je of journalEntries) {
  //     for (const line of je.lines) {
  //       const lineAccountId =
  //         typeof line.account === 'object' ? (line.account as any).id : Number(line.account);

  //       if (!accountIds.includes(lineAccountId)) continue;

  //       if (costCenter) {
  //         const lineCC =
  //           line.costCenter && typeof line.costCenter === 'object'
  //             ? (line.costCenter as any).id
  //             : line.costCenter;
  //         if (lineCC !== costCenter) continue;
  //       }

  //       const debit = Number(line.debit ?? 0);
  //       const credit = Number(line.credit ?? 0);

  //       totalDebit += debit;
  //       totalCredit += credit;
  //       runningBalance += debit - credit;

  //       details.push({
  //         entryNumber: je.sequenceNumber ?? '-',
  //         code: je.code ?? '-',
  //         date: je.date,
  //         description: je.description ?? '',
  //         costCenter: line.costCenter ?? null,
  //         debit,
  //         credit,
  //         balance: runningBalance,
  //       });
  //     }
  //   }

  //   const closingBalance = runningBalance;
  //   const balanceType = closingBalance > 0 ? 'Debit' : closingBalance < 0 ? 'Credit' : 'Balanced';

  //   return {
  //     accountId,
  //     costCenter: costCenter ?? 'All',
  //     period: { startDate: start, endDate: end },
  //     openingBalance,
  //     totalDebit,
  //     totalCredit,
  //     closingBalance,
  //     balanceType,
  //     details,
  //   };
  // }

  // async getGeneralLedger(dto: GetLedgerDto): Promise<LedgerResult> {
  //   const { accountId, startDate: startStr, endDate: endStr, costCenter } = dto;

  //   if (!accountId) {
  //     throw new BadRequestException('accountId is required');
  //   }

  //   // 🟢 1) هات كل الحسابات (الحساب الرئيسى + أولاده)
  //   const rootAccount = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //     relations: ['children'],
  //   });

  //   if (!rootAccount) {
  //     throw new NotFoundException('Account not found');
  //   }

  //   const collectIds = (acc: any): number[] => {
  //     let ids = [acc.id];
  //     if (acc.children?.length) {
  //       for (const child of acc.children) {
  //         ids = ids.concat(collectIds(child));
  //       }
  //     }
  //     return ids;
  //   };

  //   const accountIds = collectIds(rootAccount);

  //   // 🟢 2) تجهيز التواريخ
  //   const start = startStr ? new Date(startStr) : new Date('1900-01-01');
  //   const end = endStr ? new Date(endStr) : new Date();
  //   end.setHours(23, 59, 59, 999);

  //   // 🟢 3) Opening balance (لحد قبل بداية الفترة)
  //   const openingQB = this.journalEntryLineEntity.createQueryBuilder('line')
  //     .leftJoin('line.journalEntry', 'je')
  //     .leftJoin('line.account', 'account')
  //     .select('COALESCE(SUM(line.debit),0)', 'sumDebit')
  //     .addSelect('COALESCE(SUM(line.credit),0)', 'sumCredit')
  //     .where('account.id IN (:...accountIds)', { accountIds })
  //     .andWhere('je.date < :start', { start });

  //   if (costCenter) {
  //     openingQB.leftJoin('line.costCenter', 'cc').andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const openingRaw = await openingQB.getRawOne();
  //   const openingDebit = Number(openingRaw?.sumDebit ?? 0);
  //   const openingCredit = Number(openingRaw?.sumCredit ?? 0);
  //   const openingBalance = openingDebit - openingCredit;

  //   // 🟢 4) جلب القيود فى الفترة (مع استبعاد قيود الافتتاح إلا لو بتساوى startDate)
  //   const qb = this.journalEntryRepository.createQueryBuilder('je')
  //     .leftJoinAndSelect('je.lines', 'line')
  //     .leftJoinAndSelect('line.account', 'account')
  //     .leftJoinAndSelect('line.costCenter', 'cc')
  //     .where('je.date BETWEEN :start AND :end', { start, end })
  //     .andWhere('account.id IN (:...accountIds)', { accountIds })
  //     // .andWhere('(je.isOpening = false OR je.date = :start)', { start });

  //   if (costCenter) {
  //     qb.andWhere('cc.id = :costCenter', { costCenter });
  //   }

  //   const journalEntries = await qb
  //     .orderBy('je.date', 'ASC')
  //     .addOrderBy('je.sequenceNumber', 'ASC')
  //     .getMany();

  //   // 🟢 5) بناء الـ ledger
  //   const details: LedgerDetail[] = [];
  //   let runningBalance = openingBalance;
  //   let totalDebit = 0;
  //   let totalCredit = 0;

  //   // Opening row (بس لو مش صفر)
  //   if (openingBalance !== 0) {
  //     const openingDebitForTotals = openingBalance > 0 ? openingBalance : 0;
  //     const openingCreditForTotals = openingBalance < 0 ? -openingBalance : 0;

  //     totalDebit += openingDebitForTotals;
  //     totalCredit += openingCreditForTotals;

  //     details.push({
  //       entryNumber: '-',
  //       code: '-',
  //       date: start,
  //       description: 'Opening Balance',
  //       costCenter: null,
  //       debit: openingDebitForTotals,
  //       credit: openingCreditForTotals,
  //       balance: runningBalance,
  //     });
  //   }

  //   // القيود
  //   for (const je of journalEntries) {
  //     for (const line of je.lines) {
  //       const lineAccountId =
  //         typeof line.account === 'object' ? (line.account as any).id : Number(line.account);

  //       if (!accountIds.includes(lineAccountId)) continue;

  //       if (costCenter) {
  //         const lineCC =
  //           line.costCenter && typeof line.costCenter === 'object'
  //             ? (line.costCenter as any).id
  //             : line.costCenter;
  //         if (lineCC !== costCenter) continue;
  //       }

  //       const debit = Number(line.debit ?? 0);
  //       const credit = Number(line.credit ?? 0);

  //       totalDebit += debit;
  //       totalCredit += credit;
  //       runningBalance += debit - credit;

  //       details.push({
  //         entryNumber: je.sequenceNumber ?? '-',
  //         code: je.code ?? '-',
  //         date: je.date,
  //         description: je.description ?? '',
  //         costCenter: line.costCenter ?? null,
  //         debit,
  //         credit,
  //         balance: runningBalance,
  //       });
  //     }
  //   }

  //   const closingBalance = runningBalance;
  //   const balanceType = closingBalance > 0 ? 'Debit' : closingBalance < 0 ? 'Credit' : 'Balanced';

  //   return {
  //     accountId,
  //     costCenter: costCenter ?? 'All',
  //     period: { startDate: start, endDate: end },
  //     openingBalance,
  //     totalDebit,
  //     totalCredit,
  //     closingBalance,
  //     balanceType,
  //     details,
  //   };
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const {accountId , startDate , endDate} = dto;
  //   // اجمع رصيد السنوات اللى قبل الفترة المطلوبة
  //   const openingBalanceResult = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.lines', 'lines')
  //     .where('lines.accountId = :accountId', { accountId })
  //     .andWhere('entry.date < :startDate', { startDate })
  //     .select('COALESCE(SUM(lines.debit), 0)', 'debit')
  //     .addSelect('COALESCE(SUM(lines.credit), 0)', 'credit')
  //     .getRawOne();

  //   let openingBalance =
  //     (openingBalanceResult?.debit || 0) - (openingBalanceResult?.credit || 0);

  //   // هات القيود فى الفترة المطلوبة
  // const entries = await this.journalEntryRepository
  //   .createQueryBuilder("entry")
  //   .leftJoinAndSelect("entry.lines", "line")
  //   .leftJoinAndSelect("line.account", "account")
  //   .leftJoinAndSelect("line.costCenter", "costCenter") // ✅ هنا الصح
  //   .where("line.accountId = :accountId", { accountId })
  //   .andWhere("entry.date BETWEEN :startDate AND :endDate", { startDate, endDate })
  //   .orderBy("entry.date", "ASC")
  //   .getMany();

  //   // فلترة: شيل قيود الافتتاح من اليومية لو فى بداية السنة
  //   const safeStartDate = startDate ?? new Date();
  // const fiscalYearStart = new Date(safeStartDate.getFullYear(), 0, 1);
  //   // const fiscalYearStart = new Date(startDate.getFullYear(), 0, 1);
  //   let filteredEntries = entries;

  //   const safeStartDate2 = startDate ?? new Date("1900-01-01");
  // if (safeStartDate2.getTime() === fiscalYearStart.getTime()) {
  //     filteredEntries = entries.filter(
  //       (e) => !e.description?.toLowerCase().includes('opening entry'),
  //     );
  //   }

  //   // جهّز النتيجة
  //   const result: any[] = [];
  //   let runningBalance = openingBalance;

  //   // لو بداية السنة → ضيف Opening Balance
  //   if (safeStartDate.getTime() === fiscalYearStart.getTime()) {
  //     result.push({
  //       entryNo: '-',
  //       code: '-',
  //       date: startDate,
  //       costCenter: '-',
  //       description: 'Opening Balance',
  //       debit: openingBalance > 0 ? openingBalance : 0,
  //       credit: openingBalance < 0 ? -openingBalance : 0,
  //       balance: openingBalance,
  //     });
  //   }

  //   // ضيف القيود العادية
  //   for (const entry of filteredEntries) {
  // for (const line of entry.lines) {
  //   if ((line.account as any).id !== accountId) continue;

  //   runningBalance += Number(line.debit) - Number(line.credit);

  //   result.push({
  //     entryNo: entry.sequenceNumber,
  //     code: entry.code,
  //     date: entry.date,
  //     costCenter: (line.costCenter as any)?.name || '-',
  //     description: entry.description,
  //     debit: Number(line.debit),
  //     credit: Number(line.credit),
  //     balance: runningBalance,
  //   });
  // }
  //   }

  //   // Totals
  //   const totalDebit = result.reduce((s, r) => s + (r.debit || 0), 0);
  //   const totalCredit = result.reduce((s, r) => s + (r.credit || 0), 0);

  //   result.push({
  //     entryNo: 'Totals',
  //     code: '',
  //     date: '',
  //     costCenter: '',
  //     description: '',
  //     debit: totalDebit,
  //     credit: totalCredit,
  //     balance: runningBalance,
  //   });

  //   return result;
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate } = dto;

  //   // ✅ تأمين التواريخ
  //   const safeStartDate = startDate ? new Date(startDate) : new Date();
  //   const safeEndDate = endDate ? new Date(endDate) : new Date();

  //   if (isNaN(safeStartDate.getTime()) || isNaN(safeEndDate.getTime())) {
  //     throw new BadRequestException('Invalid date format');
  //   }

  //   // ✅ بداية السنة المالية
  //   const fiscalYearStart = new Date(safeStartDate.getFullYear(), 0, 1);

  //   // اجمع رصيد السنوات السابقة
  //   const openingBalanceResult = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.lines', 'lines')
  //     .where('lines.accountId = :accountId', { accountId })
  //     .andWhere('entry.date < :startDate', { startDate: safeStartDate })
  //     .select('COALESCE(SUM(lines.debit), 0)', 'debit')
  //     .addSelect('COALESCE(SUM(lines.credit), 0)', 'credit')
  //     .getRawOne();

  //   let openingBalance =
  //     (openingBalanceResult?.debit || 0) - (openingBalanceResult?.credit || 0);

  //   // هات القيود فى الفترة المطلوبة
  //   const entries = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .leftJoinAndSelect('entry.lines', 'line')
  //     .leftJoinAndSelect('line.account', 'account')
  //     .leftJoinAndSelect('line.costCenter', 'costCenter')
  //     .where('line.accountId = :accountId', { accountId })
  //     .andWhere('entry.date BETWEEN :startDate AND :endDate', {
  //       startDate: safeStartDate,
  //       endDate: safeEndDate,
  //     })
  //     .orderBy('entry.date', 'ASC')
  //     .getMany();

  //   // ✅ فلترة: لو بداية السنة → شيل "opening entry" من اليومية
  //   let filteredEntries = entries;
  //   if (safeStartDate.getTime() === fiscalYearStart.getTime()) {
  //     filteredEntries = entries.filter(
  //       (e) => !e.description?.toLowerCase().includes('opening entry'),
  //     );
  //   }

  //   // جهّز النتيجة
  //   const result: any[] = [];
  //   let runningBalance = openingBalance;

  //   // ✅ لو بداية السنة → ضيف Opening Balance مرة واحدة
  //   if (safeStartDate.getTime() === fiscalYearStart.getTime()) {
  //     result.push({
  //       entryNo: '-',
  //       code: '-',
  //       date: safeStartDate,
  //       costCenter: '-',
  //       description: 'Opening Balance',
  //       debit: openingBalance > 0 ? openingBalance : 0,
  //       credit: openingBalance < 0 ? -openingBalance : 0,
  //       balance: openingBalance,
  //     });
  //   }

  //   // ضيف القيود العادية
  //   for (const entry of filteredEntries) {
  //     for (const line of entry.lines) {
  //       if ((line.account as any).id !== accountId) continue;

  //       runningBalance += Number(line.debit) - Number(line.credit);

  //       result.push({
  //         entryNo: entry.sequenceNumber,
  //         code: entry.code,
  //         date: entry.date,
  //         costCenter: (line.costCenter as any)?.name || '-',
  //         description: entry.description,
  //         debit: Number(line.debit),
  //         credit: Number(line.credit),
  //         balance: runningBalance,
  //       });
  //     }
  //   }

  //   // Totals
  //   const totalDebit = result.reduce((s, r) => s + (r.debit || 0), 0);
  //   const totalCredit = result.reduce((s, r) => s + (r.credit || 0), 0);

  //   result.push({
  //     entryNo: 'Totals',
  //     code: '',
  //     date: '',
  //     costCenter: '',
  //     description: '',
  //     debit: totalDebit,
  //     credit: totalCredit,
  //     balance: runningBalance,
  //   });

  //   return result;
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate } = dto;

  //   // اجمع رصيد السنوات اللى قبل الفترة المطلوبة
  //   const openingBalanceResult = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .leftJoin('entry.lines', 'lines')
  //     .where('lines.accountId = :accountId', { accountId })
  //     .andWhere('entry.date < :startDate', { startDate })
  //     .select('COALESCE(SUM(lines.debit), 0)', 'debit')
  //     .addSelect('COALESCE(SUM(lines.credit), 0)', 'credit')
  //     .getRawOne();

  //   let openingBalance =
  //     (openingBalanceResult?.debit || 0) - (openingBalanceResult?.credit || 0);

  //   // هات القيود فى الفترة المطلوبة
  //   const entries = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .leftJoinAndSelect('entry.lines', 'line')
  //     .leftJoinAndSelect('line.account', 'account')
  //     .leftJoinAndSelect('line.costCenter', 'costCenter')
  //     .where('line.accountId = :accountId', { accountId })
  //     .andWhere('entry.date BETWEEN :startDate AND :endDate', { startDate, endDate })
  //     .orderBy('entry.date', 'ASC')
  //     .getMany();

  //   // فلترة: شيل قيود الافتتاح من اليومية لو فى بداية السنة
  //   const safeStartDate = startDate ? new Date(startDate) : new Date();
  //   const fiscalYearStart = new Date(safeStartDate.getFullYear(), 0, 1);
  //   let filteredEntries = entries;

  //   if (safeStartDate.getTime() === fiscalYearStart.getTime()) {
  //     filteredEntries = entries.filter(
  //       (e) => !e.description?.toLowerCase().includes('opening entry'),
  //     );
  //   }

  //   // جهّز النتيجة
  //   const details: any[] = [];
  //   let runningBalance = openingBalance;

  //   // لو بداية السنة → ضيف Opening Balance
  //   if (safeStartDate.getTime() === fiscalYearStart.getTime()) {
  //     details.push({
  //       entryNo: '-',
  //       code: '-',
  //       date: startDate,
  //       costCenter: '-',
  //       description: 'Opening Balance',
  //       debit: openingBalance > 0 ? openingBalance : 0,
  //       credit: openingBalance < 0 ? -openingBalance : 0,
  //       balance: openingBalance,
  //     });
  //   }

  //   // ضيف القيود العادية
  //   for (const entry of filteredEntries) {
  //     for (const line of entry.lines) {
  //       if ((line.account as any).id !== accountId) continue;

  //       runningBalance += Number(line.debit) - Number(line.credit);

  //       details.push({
  //         entryNo: entry.sequenceNumber,
  //         code: entry.code,
  //         date: entry.date,
  //         costCenter: (line.costCenter as any)?.name || '-',
  //         description: entry.description,
  //         debit: Number(line.debit),
  //         credit: Number(line.credit),
  //         balance: runningBalance,
  //       });
  //     }
  //   }

  //   // Totals
  //   const totalDebit = details.reduce((s, r) => s + (r.debit || 0), 0);
  //   const totalCredit = details.reduce((s, r) => s + (r.credit || 0), 0);

  //   return {
  //     details,
  //     totalDebit,
  //     totalCredit,
  //     balance: runningBalance,
  //   };
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate } = dto;
  //   // 1- هات الحساب
  //   const account = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //   });
  //   if (!account) {
  //     throw new NotFoundException('Account not found');
  //   }

  //   // 2- لو مفيش startDate، نخليه أول السنة
  //   const effectiveStartDate = startDate ?? new Date(new Date().getFullYear(), 0, 1);

  //   // 3- لو مفيش endDate، نخليه آخر السنة
  //   const effectiveEndDate = endDate ?? new Date(new Date().getFullYear(), 11, 31);

  //   // 4- هات كل القيود الخاصة بالحساب
  //   const entries = await this.journalEntryRepository.find({
  //     relations: ['details', 'details.account', 'details.costCenter'],
  //     order: { date: 'ASC', sequenceNumber: 'ASC' },
  //   });

  //   // 5- Opening Balance = كل التفاصيل قبل startDate
  //   let openingBalance = 0;
  //   for (const entry of entries) {
  //     if (entry.date < effectiveStartDate) {
  //       for (const detail of entry.lines ?? []) {
  //         if (detail.account.id === accountId) {
  //           openingBalance += detail.debit - detail.credit;
  //         }
  //       }
  //     }
  //   }

  //   // 6- القيود داخل الفترة
  //   const filteredEntries = entries.filter(
  //     (entry) =>
  //       entry.date >= effectiveStartDate && entry.date <= effectiveEndDate,
  //   );

  //   // 7- بناء التقرير
  //   const ledger: any[] = [];
  //   let runningBalance = openingBalance;

  //   // أول صف = Opening Balance
  //   ledger.push({
  //     entryNo: 'OPEN',
  //     date: effectiveStartDate,
  //     description: 'Opening Balance',
  //     debit: 0,
  //     credit: 0,
  //     balance: openingBalance,
  //   });

  //   // أضف القيود
  //   for (const entry of filteredEntries) {
  //     for (const detail of entry.lines ?? []) {
  //       if (detail.account.id === accountId) {
  //         runningBalance += detail.debit - detail.credit;
  //         ledger.push({
  //           // entryNo: `${entry.fiscalYear?.code || ''}-${entry.sequenceNumber}`,
  //           entryNo: `${entry.fiscalYear?.id || ''}-${entry.sequenceNumber}`,
  //           date: entry.date,
  //           costCenter: detail.costCenter?.name || '',
  //           description: entry.description,
  //           debit: detail.debit,
  //           credit: detail.credit,
  //           balance: runningBalance,
  //         });
  //       }
  //     }
  //   }

  //   // 8- المجموعات النهائية
  //   const totals = {
  //     debit: ledger.reduce((sum, l) => sum + (l.debit || 0), 0),
  //     credit: ledger.reduce((sum, l) => sum + (l.credit || 0), 0),
  //     balance: runningBalance,
  //   };

  //   return { account, ledger, totals };
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate } = dto;

  //   // 1- هات الحساب
  //   const account = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //   });
  //   if (!account) {
  //     throw new NotFoundException('Account not found');
  //   }

  //   // 2- لو مفيش startDate، نخليه أول السنة
  //   const effectiveStartDate =
  //     startDate ?? new Date(new Date().getFullYear(), 0, 1);

  //   // 3- لو مفيش endDate، نخليه آخر السنة
  //   const effectiveEndDate =
  //     endDate ?? new Date(new Date().getFullYear(), 11, 31);

  //   // 4- هات كل القيود مع العلاقات
  //   const entries = await this.journalEntryRepository.find({
  //     relations: ['lines', 'lines.account', 'lines.costCenter', 'fiscalYear'],
  //     order: { date: 'ASC', sequenceNumber: 'ASC' },
  //   });

  //   // 5- Opening Balance = كل التفاصيل قبل startDate
  //   let openingBalance = 0;
  //   for (const entry of entries) {
  //     if (entry.date < effectiveStartDate) {
  //       for (const line of entry.lines ?? []) {
  //         if (line.account.id === accountId) {
  //           openingBalance += line.debit - line.credit;
  //         }
  //       }
  //     }
  //   }

  //   // 6- القيود داخل الفترة
  //   const filteredEntries = entries.filter(
  //     (entry) =>
  //       entry.date >= effectiveStartDate && entry.date <= effectiveEndDate,
  //   );

  //   // 7- بناء التقرير
  //   const ledger: any[] = [];
  //   let runningBalance = openingBalance;

  //   // أول صف = Opening Balance
  //   ledger.push({
  //     entryNo: 'OPEN',
  //     date: effectiveStartDate,
  //     description: 'Opening Balance',
  //     debit: 0,
  //     credit: 0,
  //     balance: openingBalance,
  //     costCenter: '',
  //   });

  //   // أضف القيود
  //   for (const entry of filteredEntries) {
  //     for (const line of entry.lines ?? []) {
  //       if (line.account.id === accountId) {
  //         runningBalance += line.debit - line.credit;
  //         ledger.push({
  //           entryNo: `${entry.fiscalYear?.id || ''}-${entry.sequenceNumber}`,
  //           date: entry.date,
  //           costCenter: line.costCenter?.name || '',
  //           description: entry.description,
  //           debit: line.debit,
  //           credit: line.credit,
  //           balance: runningBalance,
  //         });
  //       }
  //     }
  //   }

  //   // 8- المجموعات النهائية
  //   const totals = {
  //     debit: ledger.reduce((sum, l) => sum + (l.debit || 0), 0),
  //     credit: ledger.reduce((sum, l) => sum + (l.credit || 0), 0),
  //     balance: runningBalance,
  //   };

  //   return { account, ledger, totals };
  // }

  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate } = dto;

  //   // 1- هات الحساب
  //   const account = await this.accountRepository.findOne({
  //     where: { id: accountId },
  //   });
  //   if (!account) {
  //     throw new NotFoundException('Account not found');
  //   }

  //   // 2- لو مفيش startDate → أول السنة
  //   const effectiveStartDate = startDate
  //     ? new Date(startDate)
  //     : new Date(new Date().getFullYear(), 0, 1);

  //   // 3- لو مفيش endDate → آخر السنة
  //   const effectiveEndDate = endDate
  //     ? new Date(endDate)
  //     : new Date(new Date().getFullYear(), 11, 31);

  //   // 4- هات القيود
  // const entries = await this.journalEntryRepository.find({
  //   relations: ['lines', 'lines.account', 'lines.costCenter'],
  //   order: { date: 'ASC', sequenceNumber: 'ASC' },
  // });
  //   // 5- Opening Balance = قبل startDate
  //   let openingBalance = 0;
  //   for (const entry of entries) {
  //     if (entry.date < effectiveStartDate) {
  //       for (const detail of entry.lines ?? []) {
  //         if (detail.account.id === accountId) {
  //           openingBalance += Number(detail.debit) - Number(detail.credit);
  //         }
  //       }
  //     }
  //   }

  //   // 6- القيود داخل الفترة
  //   const filteredEntries = entries.filter(
  //     (entry) => entry.date >= effectiveStartDate && entry.date <= effectiveEndDate,
  //   );

  //   // 7- بناء التقرير
  //   const ledger: any[] = [];
  //   let runningBalance = openingBalance;

  //   // Opening Balance Row
  //   ledger.push({
  //     entryNo: 'OPEN',
  //     date: effectiveStartDate,
  //     description: 'Opening Balance',
  //     debit: 0,
  //     credit: 0,
  //     balance: openingBalance,
  //     costCenter: '',
  //   });

  //   // Add Entries
  //   for (const entry of filteredEntries) {
  //     for (const detail of entry.lines ?? []) {
  //       if (detail.account.id === accountId) {
  //         runningBalance += Number(detail.debit) - Number(detail.credit);
  //         ledger.push({
  //           entryNo: `FY-${entry.sequenceNumber}`,
  //           date: entry.date,
  //           costCenter: detail.costCenter?.name || '',
  //           description: entry.description,
  //           debit: Number(detail.debit),
  //           credit: Number(detail.credit),
  //           balance: runningBalance,
  //         });
  //       }
  //     }
  //   }

  //   // 8- Totals
  //   const totals = {
  //     debit: ledger.reduce((sum, l) => sum + (l.debit || 0), 0),
  //     credit: ledger.reduce((sum, l) => sum + (l.credit || 0), 0),
  //     balance: runningBalance,
  //   };

  //   return { account, ledger, totals };
  // }

  async getGeneralLedger(dto: GetLedgerDto) {
    const { accountId, startDate, endDate } = dto;

    // 1- هات الحساب
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // 2- تواريخ آمنة
    const effectiveStartDate =
      startDate ?? new Date(new Date().getFullYear(), 0, 1);
    const effectiveEndDate =
      endDate ?? new Date(new Date().getFullYear(), 11, 31);

    // 3- اجمع الرصيد قبل الفترة (Opening Balance)
    const previousEntries = await this.journalEntryRepository.find({
      where: { date: LessThan(effectiveStartDate) },
      relations: ['lines', 'lines.account'],
    });

    let openingBalance = 0;
    for (const entry of previousEntries) {
      for (const line of entry.lines ?? []) {
        if (line.account.id === accountId) {
          openingBalance += Number(line.debit) - Number(line.credit);
        }
      }
    }

    // 4- هات القيود داخل الفترة
    const entries = await this.journalEntryRepository.find({
      where: { date: Between(effectiveStartDate, effectiveEndDate) },
      relations: ['lines', 'lines.account', 'lines.costCenter', 'fiscalYear'],
      order: { date: 'ASC', sequenceNumber: 'ASC' },
    });

    // 5- جهز التقرير
    const ledger: any[] = [];
    let runningBalance = openingBalance;

    // Opening Balance row
    ledger.push({
      entryNo: 'OPEN',
      date: effectiveStartDate,
      description: 'Opening Balance',
      debit: 0,
      credit: 0,
      balance: openingBalance,
      costCenter: '',
    });

    // القيود
    for (const entry of entries) {
      for (const line of entry.lines ?? []) {
        if (line.account.id === accountId) {
          runningBalance += Number(line.debit) - Number(line.credit);
          ledger.push({
            entryNo: `${entry.sequenceNumber}`,
            date: entry.date,
            costCenter: line.costCenter?.name || '',
            description: entry.description,
            debit: Number(line.debit),
            credit: Number(line.credit),
            balance: runningBalance,
          });
        }
      }
    }

    // 6- إجماليات
    const totals = {
      debit: ledger.reduce((sum, l) => sum + (l.debit || 0), 0),
      credit: ledger.reduce((sum, l) => sum + (l.credit || 0), 0),
      balance: runningBalance,
    };

    return { account, ledger, totals };
  }
}
