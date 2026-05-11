import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, AccountType } from 'src/chart/entities/chart.entity';
import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { OpeningBalanceEntity } from 'src/opening-balance/entities/opening-balance.entity';
import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';
import { GetTrialBalanceDto } from './dto/get-general-trial-balance.dto';
import { GetAccountTrialBalanceDto } from './dto/get-account-trial-balance.dto';

// ─── Response Types ───────────────────────────────────────────────────────────
export interface TrialBalanceRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  level: number;
  isMain: boolean;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface TrialBalanceTotals {
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface TrialBalanceResult {
  startDate: string;
  endDate: string;
  level: number | null;
  isEstimated: boolean;
  rows: TrialBalanceRow[];
  totals: TrialBalanceTotals;
}

export interface AccountTrialBalanceResult {
  account: {
    id: number;
    code: string;
    name: string;
    isMain: boolean;
  };
  startDate: string;
  endDate: string;
  isEstimated: boolean;
  rows: TrialBalanceRow[];
  totals: TrialBalanceTotals;
}

// ─── Internal Type ────────────────────────────────────────────────────────────
type AmountMap = Record<number, { debit: number; credit: number }>;

// ─────────────────────────────────────────────────────────────────────────────
@Injectable()
export class TrialBalanceService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,

    @InjectRepository(JournalEntryLineEntity)
    private readonly journalLineRepository: Repository<JournalEntryLineEntity>,

    // ✅ بنتعامل مع opening_balance table مباشرةً
    // بدون ما نستخدم OpeningBalanceService عشان نتجنب الـ N+1
    @InjectRepository(OpeningBalanceEntity)
    private readonly openingBalanceRepository: Repository<OpeningBalanceEntity>,

    private readonly fiscalYearService: FiscalYearService,
  ) {}

  // ===========================================================================
  // ✅ BULK Query 1
  // Opening Balances من جدول opening_balance مباشرةً
  // query واحدة بـ GROUP BY بدل N query
  // ===========================================================================
  private async bulkGetOpeningFromTable(
    fiscalYear: number,
    costCenter?: number,
  ): Promise<AmountMap> {
    const qb = this.openingBalanceRepository
      .createQueryBuilder('ob')
      .innerJoin('ob.fiscalYear', 'fy')
      .leftJoin('ob.costCenter', 'cc')
      .select([
        'ob.accountId                  AS "accountId"',
        'COALESCE(SUM(ob.debit),  0)  AS "totalDebit"',
        'COALESCE(SUM(ob.credit), 0)  AS "totalCredit"',
      ])
      .where('fy.year = :fiscalYear', { fiscalYear })
      .groupBy('ob.accountId');

    if (costCenter !== undefined) {
      qb.andWhere('cc.id = :costCenter', { costCenter });
    }

    const rows = await qb.getRawMany();
    return this.toAmountMap(rows, 'accountId', 'totalDebit', 'totalCredit');
  }

  // ===========================================================================
  // ✅ BULK Query 2
  // Opening on-the-fly من journal_lines لو السنة السابقة مفتوحة
  // query واحدة بـ GROUP BY لكل الحسابات
  // ===========================================================================
  private async bulkGetOpeningOnTheFly(
    prevYear: number,
    costCenter?: number,
  ): Promise<AmountMap> {
    const qb = this.journalLineRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('entry.fiscalYear', 'fy')
      .innerJoin('line.account', 'account')
      .leftJoin('line.costCenter', 'cc')
      .select([
        'line.accountId                AS "accountId"',
        'COALESCE(SUM(line.debit),  0) AS "totalDebit"',
        'COALESCE(SUM(line.credit), 0) AS "totalCredit"',
      ])
      .where('fy.year = :prevYear', { prevYear })
      .andWhere('entry.isClosing = false')
      .andWhere('account.type IN (:...types)', {
        types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
      })
      .groupBy('line.accountId');

    if (costCenter !== undefined) {
      qb.andWhere('cc.id = :costCenter', { costCenter });
    }

    const rows = await qb.getRawMany();
    return this.toAmountMap(rows, 'accountId', 'totalDebit', 'totalCredit');
  }

  // ===========================================================================
  // ✅ BULK Query 3
  // حركة الفترة من journal_lines بـ GROUP BY
  // query واحدة لكل الحسابات
  // ===========================================================================
  private async bulkGetPeriodMovement(
    startDate: Date,
    endDate: Date,
    costCenter?: number,
  ): Promise<AmountMap> {
    const qb = this.journalLineRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .leftJoin('line.costCenter', 'cc')
      .select([
        'line.accountId                AS "accountId"',
        'COALESCE(SUM(line.debit),  0) AS "totalDebit"',
        'COALESCE(SUM(line.credit), 0) AS "totalCredit"',
      ])
      .where('entry.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('entry.isClosing = false')
      .andWhere('entry.isOpening = false')
      .groupBy('line.accountId');

    if (costCenter !== undefined) {
      qb.andWhere('cc.id = :costCenter', { costCenter });
    }

    const rows = await qb.getRawMany();
    return this.toAmountMap(rows, 'accountId', 'totalDebit', 'totalCredit');
  }

  // ===========================================================================
  // ✅ BULK Query 4
  // حركة ما قبل startDate (لتعديل الـ opening لو مش أول السنة)
  // query واحدة — بترجع {} فاضي لو أول السنة
  // ===========================================================================
  private async bulkGetPrePeriodMovement(
    startDate: Date,
    startYear: number,
    costCenter?: number,
  ): Promise<AmountMap> {
    const isStartOfYear =
      startDate.getMonth() === 0 && startDate.getDate() === 1;

    // لو أول السنة → مفيش حركة قبلها → مش محتاج query
    if (isStartOfYear) return {};

    const qb = this.journalLineRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .leftJoin('line.costCenter', 'cc')
      .select([
        'line.accountId                AS "accountId"',
        'COALESCE(SUM(line.debit),  0) AS "totalDebit"',
        'COALESCE(SUM(line.credit), 0) AS "totalCredit"',
      ])
      .where('entry.date BETWEEN :from AND :to', {
        from: new Date(startYear, 0, 1),
        to: new Date(startDate.getTime() - 1),
      })
      .andWhere('entry.isClosing = false')
      .andWhere('entry.isOpening = false')
      .groupBy('line.accountId');

    if (costCenter !== undefined) {
      qb.andWhere('cc.id = :costCenter', { costCenter });
    }

    const rows = await qb.getRawMany();
    return this.toAmountMap(rows, 'accountId', 'totalDebit', 'totalCredit');
  }

  // ===========================================================================
  // ✅ يحدد مصدر الـ Opening ويرجع AmountMap + isEstimated
  // ===========================================================================
  private async resolveOpeningMap(
    startYear: number,
    costCenter?: number,
  ): Promise<{ openingMap: AmountMap; isEstimated: boolean }> {
    const prevYear = startYear - 1;
    const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);

    // ✅ أول سنة أو السنة السابقة متقفلة → opening_balance table
    if (!prevFiscalYear || prevFiscalYear.isClosed) {
      const openingMap = await this.bulkGetOpeningFromTable(
        startYear,
        costCenter,
      );
      return { openingMap, isEstimated: false };
    }

    // ⚠️ السنة السابقة مفتوحة → on-the-fly من journal_lines
    const openingMap = await this.bulkGetOpeningOnTheFly(prevYear, costCenter);
    return { openingMap, isEstimated: true };
  }

  // ===========================================================================
  // ✅ Helper Methods — كلها تشتغل في memory بدون DB queries
  // ===========================================================================

  private toAmountMap(
    rows: any[],
    idKey: string,
    debitKey: string,
    creditKey: string,
  ): AmountMap {
    const map: AmountMap = {};
    for (const r of rows) {
      const id = Number(r[idKey]);
      if (!id) continue;
      map[id] = {
        debit: parseFloat(r[debitKey]) || 0,
        credit: parseFloat(r[creditKey]) || 0,
      };
    }
    return map;
  }

  // جمع قيم مجموعة IDs من map موجود في memory
  private sumFromMap(
    ids: number[],
    map: AmountMap,
  ): { debit: number; credit: number } {
    let debit = 0,
      credit = 0;
    for (const id of ids) {
      if (map[id]) {
        debit += map[id].debit;
        credit += map[id].credit;
      }
    }
    return { debit, credit };
  }

  // بناء level map لكل الحسابات
  private buildLevelMap(accounts: AccountEntity[]): Map<number, number> {
    const levelMap = new Map<number, number>();
    const parentMap = new Map<number, number | null>();
    for (const a of accounts) parentMap.set(a.id, a.parent?.id ?? null);

    const getLevel = (id: number): number => {
      if (levelMap.has(id)) return levelMap.get(id)!;
      const parentId = parentMap.get(id);
      if (!parentId) {
        levelMap.set(id, 1);
        return 1;
      }
      const level = getLevel(parentId) + 1;
      levelMap.set(id, level);
      return level;
    };

    accounts.forEach((a) => getLevel(a.id));
    return levelMap;
  }

  // بناء شجرة الأبناء: parentId → [childIds]
  private buildChildrenMap(accounts: AccountEntity[]): Map<number, number[]> {
    const map = new Map<number, number[]>();
    for (const a of accounts) {
      if (a.parent?.id) {
        if (!map.has(a.parent.id)) map.set(a.parent.id, []);
        map.get(a.parent.id)!.push(a.id);
      }
    }
    return map;
  }

  // جيب كل الـ descendants من childrenMap (بدون DB)
  private getDescendantIds(
    accountId: number,
    childrenMap: Map<number, number[]>,
  ): number[] {
    const result: number[] = [accountId];
    const queue = [accountId];
    while (queue.length) {
      const current = queue.shift()!;
      const children = childrenMap.get(current) ?? [];
      for (const child of children) {
        result.push(child);
        queue.push(child);
      }
    }
    return result;
  }

  // بناء صف واحد في الميزان
  private buildRow(
    account: AccountEntity,
    level: number,
    openingDebit: number,
    openingCredit: number,
    periodDebit: number,
    periodCredit: number,
  ): TrialBalanceRow {
    const openingNet = openingDebit - openingCredit;
    const closingNet = openingNet + periodDebit - periodCredit;
    return {
      accountId: account.id,
      accountCode: account.accountCode,
      accountName: account.name,
      level,
      isMain: account.isMain,
      openingDebit,
      openingCredit,
      periodDebit,
      periodCredit,
      closingDebit: closingNet > 0 ? closingNet : 0,
      closingCredit: closingNet < 0 ? Math.abs(closingNet) : 0,
    };
  }

  private calcTotals(rows: TrialBalanceRow[]): TrialBalanceTotals {
    return {
      openingDebit: rows.reduce((s, r) => s + r.openingDebit, 0),
      openingCredit: rows.reduce((s, r) => s + r.openingCredit, 0),
      periodDebit: rows.reduce((s, r) => s + r.periodDebit, 0),
      periodCredit: rows.reduce((s, r) => s + r.periodCredit, 0),
      closingDebit: rows.reduce((s, r) => s + r.closingDebit, 0),
      closingCredit: rows.reduce((s, r) => s + r.closingCredit, 0),
    };
  }

  // ===========================================================================
  // ✅ Route 1: Trial Balance للشركة كلها
  //
  // عدد الـ DB Queries = 4 فقط بغض النظر عن عدد الحسابات:
  //   Q1 — accounts table
  //   Q2 — opening_balance table (أو journal_lines لو السنة السابقة مفتوحة)
  //   Q3 — pre-period journal_lines  (بس لو مش أول السنة)
  //   Q4 — period journal_lines
  //   ثم كل الـ aggregation بيتعمل في memory
  // ===========================================================================
  async getCompanyTrialBalance(
    dto: GetTrialBalanceDto,
  ): Promise<TrialBalanceResult> {
    const { startDate, endDate, level } = dto;

    const effectiveStart = new Date(startDate + 'T00:00:00');
    const effectiveEnd = new Date(endDate + 'T23:59:59');
    const startYear = effectiveStart.getFullYear();
    const endYear = effectiveEnd.getFullYear();

    if (startYear !== endYear) {
      throw new BadRequestException(
        'startDate and endDate must be within the same fiscal year',
      );
    }

    // ─── Q1: جيب كل الحسابات مرة واحدة ───────────────────────
    const allAccounts = await this.accountRepository.find({
      relations: ['parent'],
      order: { accountCode: 'ASC' },
    });

    // بناء الـ maps في memory
    const levelMap = this.buildLevelMap(allAccounts);
    const childrenMap = this.buildChildrenMap(allAccounts);

    // ─── Q2 + Q3 + Q4 بالتوازي ────────────────────────────────
    const [{ openingMap, isEstimated }, prePeriodMap, periodMap] =
      await Promise.all([
        this.resolveOpeningMap(startYear),
        this.bulkGetPrePeriodMovement(effectiveStart, startYear),
        this.bulkGetPeriodMovement(effectiveStart, effectiveEnd),
      ]);

    // ─── بناء الصفوف في memory ────────────────────────────────
    const targetAccounts = level
      ? allAccounts.filter((a) => levelMap.get(a.id) === level)
      : allAccounts;

    const rows: TrialBalanceRow[] = [];

    for (const account of targetAccounts) {
      const accountLevel = levelMap.get(account.id) ?? 1;

      // لو رئيسي → نجمع الفرعية من الـ maps في memory (بدون DB)
      const ids = account.isMain
        ? this.getDescendantIds(account.id, childrenMap)
        : [account.id];

      const opening = this.sumFromMap(ids, openingMap);
      const prePeriod = this.sumFromMap(ids, prePeriodMap);
      const period = this.sumFromMap(ids, periodMap);

      const adjOpeningDebit = opening.debit + prePeriod.debit;
      const adjOpeningCredit = opening.credit + prePeriod.credit;

      if (
        adjOpeningDebit === 0 &&
        adjOpeningCredit === 0 &&
        period.debit === 0 &&
        period.credit === 0
      )
        continue;

      rows.push(
        this.buildRow(
          account,
          accountLevel,
          adjOpeningDebit,
          adjOpeningCredit,
          period.debit,
          period.credit,
        ),
      );
    }

    return {
      startDate,
      endDate,
      level: level ?? null,
      isEstimated,
      rows,
      totals: this.calcTotals(rows),
    };
  }

  // ===========================================================================
  // ✅ Route 2: Trial Balance لحساب معين
  //
  // نفس الـ approach — 4 queries بس
  // ===========================================================================
  async getAccountTrialBalance(
    dto: GetAccountTrialBalanceDto,
  ): Promise<AccountTrialBalanceResult> {
    const { accountId, startDate, endDate, costCenter } = dto;

    const effectiveStart = new Date(startDate + 'T00:00:00');
    const effectiveEnd = new Date(endDate + 'T23:59:59');
    const startYear = effectiveStart.getFullYear();
    const endYear = effectiveEnd.getFullYear();

    if (startYear !== endYear) {
      throw new BadRequestException(
        'startDate and endDate must be within the same fiscal year',
      );
    }

    // ─── Q1: جيب الحساب + كل الحسابات للـ maps ────────────────
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: ['parent'],
    });
    if (!account) throw new NotFoundException('Account not found');

    const allAccounts = await this.accountRepository.find({
      relations: ['parent'],
      order: { accountCode: 'ASC' },
    });

    const levelMap = this.buildLevelMap(allAccounts);
    const childrenMap = this.buildChildrenMap(allAccounts);

    // ─── Q2 + Q3 + Q4 بالتوازي ────────────────────────────────
    const [{ openingMap, isEstimated }, prePeriodMap, periodMap] =
      await Promise.all([
        this.resolveOpeningMap(startYear, costCenter),
        this.bulkGetPrePeriodMovement(effectiveStart, startYear, costCenter),
        this.bulkGetPeriodMovement(effectiveStart, effectiveEnd, costCenter),
      ]);

    const rows: TrialBalanceRow[] = [];

    if (account.isMain) {
      // ─── رئيسي → صف لكل ابن مباشر ───────────────────────────
      const directChildIds = childrenMap.get(accountId) ?? [];
      const directChildren = allAccounts.filter((a) =>
        directChildIds.includes(a.id),
      );

      for (const child of directChildren) {
        const childLevel = levelMap.get(child.id) ?? 2;

        const ids = child.isMain
          ? this.getDescendantIds(child.id, childrenMap)
          : [child.id];

        const opening = this.sumFromMap(ids, openingMap);
        const prePeriod = this.sumFromMap(ids, prePeriodMap);
        const period = this.sumFromMap(ids, periodMap);

        const adjOpeningDebit = opening.debit + prePeriod.debit;
        const adjOpeningCredit = opening.credit + prePeriod.credit;

        if (
          adjOpeningDebit === 0 &&
          adjOpeningCredit === 0 &&
          period.debit === 0 &&
          period.credit === 0
        )
          continue;

        rows.push(
          this.buildRow(
            child,
            childLevel,
            adjOpeningDebit,
            adjOpeningCredit,
            period.debit,
            period.credit,
          ),
        );
      }
    } else {
      // ─── فرعي → صف واحد بس ───────────────────────────────────
      const accountLevel = levelMap.get(accountId) ?? 1;
      const opening = this.sumFromMap([accountId], openingMap);
      const prePeriod = this.sumFromMap([accountId], prePeriodMap);
      const period = this.sumFromMap([accountId], periodMap);

      rows.push(
        this.buildRow(
          account,
          accountLevel,
          opening.debit + prePeriod.debit,
          opening.credit + prePeriod.credit,
          period.debit,
          period.credit,
        ),
      );
    }

    return {
      account: {
        id: account.id,
        code: account.accountCode,
        name: account.name,
        isMain: account.isMain,
      },
      startDate,
      endDate,
      isEstimated,
      rows,
      totals: this.calcTotals(rows),
    };
  }
}
