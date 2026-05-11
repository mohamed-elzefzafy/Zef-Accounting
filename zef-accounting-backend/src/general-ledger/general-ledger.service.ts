import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from '../journal-entries/entities/journal-entry.entity';
import { GetLedgerDto } from './dto/get-ledger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { FiscalYearEntity } from 'src/fiscal-year/entities/fiscal-year.entity';
import { OpeningBalanceService } from 'src/opening-balance/opening-balance.service';

export interface LedgerDetail {
  entryNo: string | number;
  code: string;
  date: Date | string;
  description: string;
  costCenter: string;
  debit: number;
  credit: number;
  balance: number | string;
  fiscalYear?: number | string;
  isOpeningBalance?: boolean;
  isClosingBalance?: boolean;
  isEstimated?: boolean;
}

export interface LedgerTotals {
  debit: number;
  credit: number;
  openingBalance: number;
  closingBalance: number;
}

export interface LedgerResult {
  account: AccountEntity;
  ledger: LedgerDetail[];
  totals: LedgerTotals;
  isEstimated: boolean;
  fiscalYears: {
    id: string;
    year: number;
    isClosed: boolean;
    closedAt: Date | null;
  }[];
}

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectRepository(JournalEntryEntity)
    private readonly journalEntryRepository: Repository<JournalEntryEntity>,

    @InjectRepository(JournalEntryLineEntity)
    private readonly journalEntryLineRepository: Repository<JournalEntryLineEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(FiscalYearEntity)
    private readonly fiscalYearRepository: Repository<FiscalYearEntity>,

    private readonly openingBalanceService: OpeningBalanceService,
  ) {}

// =========================================================
// ✅ دالة مساعدة: جيب IDs الحساب + كل الفرعية recursively
// =========================================================
private async getDescendantAccountIds(accountId: number): Promise<number[]> {
  const allIds = new Set<number>([accountId]);

  const fetchChildren = async (parentIds: number[]) => {
    if (!parentIds.length) return;

    const children = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .where('account.parent IN (:...parentIds)', { parentIds })
      .getRawMany();

    const childIds = children
      .map((c) => Number(c.id))
      .filter((id) => !allIds.has(id));

    if (!childIds.length) return;

    childIds.forEach((id) => allIds.add(id));
    await fetchChildren(childIds);
  };

  await fetchChildren([accountId]);

  return [...allIds];
}

// =========================================================
// ✅ getGeneralLedger — يدعم الحساب الرئيسي والفرعي
// =========================================================
async getGeneralLedger(dto: GetLedgerDto): Promise<LedgerResult> {
  const { accountId, startDate, endDate, costCenter } = dto;

  // ─── 1. هات الحساب ────────────────────────────────────
  const account = await this.accountRepository.findOne({
    where: { id: accountId },
  });
  if (!account) throw new NotFoundException('Account not found');

  // ─── 2. جيب كل IDs المطلوبة ───────────────────────────
  // لو الحساب رئيسي → جيب الفرعية كلها، لو فرعي → هو بس
  const accountIds = account.isMain
    ? await this.getDescendantAccountIds(accountId)
    : [accountId];

  // ─── 3. تواريخ آمنة (fix timezone) ────────────────────
  const effectiveStartDate = startDate
    ? new Date(startDate + 'T00:00:00')
    : new Date(new Date().getFullYear(), 0, 1);

  const effectiveEndDate = endDate
    ? new Date(endDate + 'T23:59:59')
    : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

  // ─── 4. منع اختلاف السنة المالية ─────────────────────
  const startYear = effectiveStartDate.getFullYear();
  const endYear   = effectiveEndDate.getFullYear();

  if (startYear !== endYear) {
    throw new BadRequestException(
      'startDate and endDate must be within the same fiscal year',
    );
  }

  // ─── 5. السنة المالية ─────────────────────────────────
  const fiscalYears = await this.fiscalYearRepository.find({
    where: { year: startYear },
    order: { year: 'ASC' },
  });

  // ─── 6. Opening Balance ───────────────────────────────
  // لو رئيسي → نجمع الفرعية كلها دفعة واحدة
  // لو فرعي  → نجيبه بشكل عادي
  let openingData: { openingDebit: number; openingCredit: number; isEstimated: boolean };

  if (account.isMain) {
    openingData = await this.openingBalanceService.getOpeningBalanceForLedgerMulti(
      accountIds,
      startYear,
      costCenter,
    );
  } else {
    openingData = await this.openingBalanceService.getOpeningBalanceForLedger(
      accountId,
      startYear,
      costCenter,
    );
  }

  const isEstimated    = openingData.isEstimated;
  let openingBalance   = openingData.openingDebit - openingData.openingCredit;

  // ─── 7. حركات قبل startDate (لو مش أول السنة) ────────
  let adjustedOpeningBalance = openingBalance;

  const isStartOfYear =
    effectiveStartDate.getMonth() === 0 &&
    effectiveStartDate.getDate()  === 1;

  if (!isStartOfYear) {
    const preEntries = await this.journalEntryRepository.find({
      where: {
        date:      Between(
          new Date(startYear, 0, 1),
          new Date(effectiveStartDate.getTime() - 1),
        ),
        isClosing: false,
        isOpening: false,
      },
      relations: ['lines', 'lines.account', 'lines.costCenter'],
    });

    let preDebit  = 0;
    let preCredit = 0;

    for (const entry of preEntries) {
      const filteredLines = entry.lines?.filter(
        (l) =>
          accountIds.includes(l.account.id) && // ✅ كل الفرعية
          (!costCenter || l.costCenter?.id === costCenter),
      );

      for (const line of filteredLines ?? []) {
        preDebit  += Number(line.debit)  || 0;
        preCredit += Number(line.credit) || 0;
      }
    }

    adjustedOpeningBalance += preDebit - preCredit;
  }

  // ─── 8. القيود داخل الفترة ────────────────────────────
  const entries = await this.journalEntryRepository.find({
    where: {
      date:      Between(effectiveStartDate, effectiveEndDate),
      isClosing: false,
      isOpening: false,
    },
    relations: ['lines', 'lines.account', 'lines.costCenter', 'fiscalYear'],
    order:     { date: 'ASC', sequenceNumber: 'ASC' },
  });

  // ─── 9. بناء التقرير ──────────────────────────────────
  const ledger: LedgerDetail[] = [];
  let runningBalance = adjustedOpeningBalance;

  // ✅ Opening Row
  ledger.push({
    entryNo:     'OPEN',
    date:        effectiveStartDate,
    costCenter:  '',
    description: isEstimated
      ? 'Opening Balance ⚠️ (Estimated - Previous year not closed yet)'
      : 'Opening Balance',
    code:             '',
    debit:            adjustedOpeningBalance > 0 ? adjustedOpeningBalance : 0,
    credit:           adjustedOpeningBalance < 0 ? Math.abs(adjustedOpeningBalance) : 0,
    balance:          adjustedOpeningBalance,
    fiscalYear:       startYear,
    isOpeningBalance: true,
    isEstimated,
  });

  // ✅ القيود
  for (const entry of entries) {
    const filteredLines = entry.lines?.filter(
      (l) =>
        accountIds.includes(l.account.id) && // ✅ كل الفرعية
        (!costCenter || l.costCenter?.id === costCenter),
    );

    for (const line of filteredLines ?? []) {
      const debit  = Number(line.debit)  || 0;
      const credit = Number(line.credit) || 0;

      runningBalance += debit - credit;

      ledger.push({
        entryNo:     entry.sequenceNumber,
        date:        entry.date,
        costCenter:  line.costCenter?.name || '',
        description: line.description || entry.description,
        code:        entry.code,
        debit,
        credit,
        balance:     runningBalance,
        fiscalYear:  entry.fiscalYear?.year || '',
        isOpeningBalance: false,
      });
    }
  }

  // ─── 10. Closing Row ──────────────────────────────────
  const finalNature =
    runningBalance > 0 ? '(Debit)'  :
    runningBalance < 0 ? '(Credit)' : '';

  ledger.push({
    entryNo:     '',
    date:        effectiveEndDate,
    costCenter:  '',
    description: `Closing Balance ${finalNature}`,
    code:        '',
    debit:       runningBalance < 0 ? Math.abs(runningBalance) : 0,
    credit:      runningBalance >= 0 ? Math.abs(runningBalance) : 0,
    balance:     '',
    fiscalYear:  startYear,
    isClosingBalance: true,
  });

  // ─── 11. Totals ───────────────────────────────────────
  const totals: LedgerTotals = {
    debit:          ledger.reduce((sum, l) => sum + (l.debit  || 0), 0),
    credit:         ledger.reduce((sum, l) => sum + (l.credit || 0), 0),
    openingBalance: adjustedOpeningBalance,
    closingBalance: runningBalance,
  };

  return {
    account,
    ledger,
    totals,
    isEstimated,
    fiscalYears: fiscalYears.map((fy) => ({
      id:       fy.id,
      year:     fy.year,
      isClosed: fy.isClosed,
      closedAt: fy.closedAt,
    })),
  };
}
}
