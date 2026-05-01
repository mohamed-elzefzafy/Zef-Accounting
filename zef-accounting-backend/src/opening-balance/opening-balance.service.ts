// // src/opening-balance/opening-balance.service.ts

// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
//   forwardRef,
//   Inject,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, IsNull } from 'typeorm';
// import { OpeningBalanceEntity } from './entities/opening-balance.entity';
// import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
// import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';
// import { AccountType } from 'src/chart/entities/chart.entity';

// @Injectable()
// export class OpeningBalanceService {
//   constructor(
//     @InjectRepository(OpeningBalanceEntity)
//     private readonly openingBalanceRepository: Repository<OpeningBalanceEntity>,

//     @InjectRepository(JournalEntryLineEntity)
//     private readonly journalLineRepository: Repository<JournalEntryLineEntity>,

//     @Inject(forwardRef(() => FiscalYearService))
//     private readonly fiscalYearService: FiscalYearService,
//   ) {}

//   // =========================================================
//   // ✅ توليد الـ Opening Balance من قيود السنة السابقة
//   // =========================================================
//   async generate(targetYear: number) {
//     const prevYear = targetYear - 1;

//     // ✅ تحقق إن السنة السابقة موجودة
//     const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);
//     if (!prevFiscalYear) {
//       throw new NotFoundException(`Fiscal year ${prevYear} not found`);
//     }

//     // ✅ تحقق إن السنة السابقة متقفلة
//     if (!prevFiscalYear.isClosed) {
//       throw new BadRequestException(
//         `Fiscal year ${prevYear} must be closed before generating opening balance for ${targetYear}`,
//       );
//     }

//     // ✅ تحقق إن السنة الجديدة موجودة
//     const targetFiscalYear = await this.fiscalYearService.findOne(targetYear);
//     if (!targetFiscalYear) {
//       throw new NotFoundException(
//         `Fiscal year ${targetYear} not found. Please create it first.`,
//       );
//     }

//     // ✅ نجيب كل سطور القيود من السنة السابقة مع مراكز التكلفة
//     const lines = await this.journalLineRepository
//       .createQueryBuilder('line')
//       .innerJoin('line.journalEntry', 'entry')
//       .innerJoin('entry.fiscalYear', 'fy')
//       .innerJoin('line.account', 'account') // ✅ أضف الـ join ده
//       .leftJoinAndSelect('line.costCenter', 'costCenter')
//       .select(['line.account', 'line.debit', 'line.credit', 'costCenter.id'])
//       .where('fy.year = :year', { year: prevYear })
//       .andWhere('entry.isClosing = false')
//       .andWhere('account.type IN (:...types)', {
//         types: [AccountType.Asset, AccountType.Liability, AccountType.Equity], // ✅ بس الحسابات الدائمة
//       })
//       .getRawMany();

//     // if (!lines.length) {
//     //   throw new NotFoundException(
//     //     `No journal entry lines found for year ${prevYear}`,
//     //   );
//     // }

//     if (!lines.length) {
//   return [];
// }

//     // =========================================================
//     // ✅ نجمع الأرصدة على مستوى (حساب + مركز تكلفة)
//     // =========================================================
//     type BalanceEntry = {
//       accountId: number;
//       costCenterId: number | null;
//       debit: number;
//       credit: number;
//     };

//     const balanceMap = new Map<string, BalanceEntry>();

//     for (const line of lines) {
//       const accountId = line.line_accountId;
//       const costCenterId = line.costCenter_id ?? null;
//       const key = `${accountId}_${costCenterId ?? 'null'}`;

//       if (!balanceMap.has(key)) {
//         balanceMap.set(key, { accountId, costCenterId, debit: 0, credit: 0 });
//       }

//       const entry = balanceMap.get(key)!;
//       entry.debit += parseFloat(line.line_debit) || 0;
//       entry.credit += parseFloat(line.line_credit) || 0;
//     }

//     // =========================================================
//     // ✅ نحذف الـ opening balance القديم لو موجود (إعادة توليد)
//     // =========================================================
//     await this.openingBalanceRepository.delete({
//       fiscalYear: { id: targetFiscalYear.id },
//       isGenerated: true,
//     });

//     // =========================================================
//     // ✅ نخزن الأرصدة الجديدة
//     // =========================================================
//     const toSave: OpeningBalanceEntity[] = [];

//     for (const [, value] of balanceMap) {
//       // ✅ بس نخزن الحسابات اللي عندها رصيد (مش صفر في الاتنين)
//       if (value.debit === 0 && value.credit === 0) continue;

//       const ob = this.openingBalanceRepository.create({
//         account: { id: value.accountId } as any,
//         fiscalYear: { id: targetFiscalYear.id } as any,
//         costCenter: value.costCenterId
//           ? ({ id: value.costCenterId } as any)
//           : null,
//         debit: value.debit,
//         credit: value.credit,
//         isGenerated: true,
//       });

//       toSave.push(ob);
//     }

//     await this.openingBalanceRepository.save(toSave);

//     return {
//       message: `Opening balance for year ${targetYear} generated successfully`,
//       totalAccounts: toSave.length,
//     };
//   }

//   // =========================================================
//   // ✅ جيب الـ Opening Balance لحساب معين في سنة معينة
//   // مع أو بدون مركز تكلفة
//   // =========================================================
//   async getForAccount(
//     accountId: number,
//     fiscalYear: number,
//     costCenterId?: number,
//   ) {
//     const where: any = {
//       account: { id: accountId },
//       fiscalYear: { year: fiscalYear },
//     };

//     // ✅ لو في فلتر مركز تكلفة
//     if (costCenterId !== undefined) {
//       where.costCenter = { id: costCenterId };
//     }

//     const results = await this.openingBalanceRepository.find({ where });

//     // ✅ نرجع مجموع الـ debit والـ credit
//     const totalDebit = results.reduce(
//       (sum, r) => sum + parseFloat(r.debit as any),
//       0,
//     );
//     const totalCredit = results.reduce(
//       (sum, r) => sum + parseFloat(r.credit as any),
//       0,
//     );

//     return {
//       accountId,
//       fiscalYear,
//       costCenterId: costCenterId ?? null,
//       openingDebit: totalDebit,
//       openingCredit: totalCredit,
//       netBalance: totalDebit - totalCredit,
//     };
//   }

//   // =========================================================
//   // ✅ جيب كل الأرصدة الافتتاحية لسنة معينة
//   // =========================================================
//   async findAllForYear(year: number) {
//     return this.openingBalanceRepository.find({
//       where: { fiscalYear: { year } },
//       relations: ['account', 'costCenter', 'fiscalYear'],
//       order: { account: { id: 'ASC' } },
//     });
//   }

//   // =========================================================
//   // ✅ جيب الـ Opening Balance لحساب في تقرير الأستاذ
//   // بيراعي لو السنة السابقة مفتوحة → يحسب on-the-fly
//   // =========================================================
//   async getOpeningBalanceForLedger(
//     accountId: number,
//     fiscalYear: number,
//     costCenterId?: number,
//   ): Promise<{
//     openingDebit: number;
//     openingCredit: number;
//     isEstimated: boolean; // ✅ هل الرصيد محسوب ولا تقديري؟
//   }> {
//     const prevYear = fiscalYear - 1;
//     const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);

//     // ✅ السنة السابقة متقفلة → نرجع الرصيد المخزون
//     if (prevFiscalYear?.isClosed) {
//       const result = await this.getForAccount(
//         accountId,
//         fiscalYear,
//         costCenterId,
//       );
//       return {
//         openingDebit: result.openingDebit,
//         openingCredit: result.openingCredit,
//         isEstimated: false,
//       };
//     }

//     // ⚠️ السنة السابقة مفتوحة → نحسب on-the-fly من القيود
//     const qb = this.journalLineRepository
//       .createQueryBuilder('line')
//       .innerJoin('line.journalEntry', 'entry')
//       .innerJoin('entry.fiscalYear', 'fy')
//       .where('fy.year = :prevYear', { prevYear })
//       .andWhere('line.account = :accountId', { accountId })
//       .andWhere('entry.isClosing = false');

//     if (costCenterId !== undefined) {
//       qb.andWhere('line.costCenter = :costCenterId', { costCenterId });
//     } else {
//       qb.andWhere('line.costCenter IS NULL');
//     }

//     const lines = await qb
//       .select([
//         'SUM(line.debit) as totalDebit',
//         'SUM(line.credit) as totalCredit',
//       ])
//       .getRawOne();

//     return {
//       openingDebit: parseFloat(lines?.totalDebit) || 0,
//       openingCredit: parseFloat(lines?.totalCredit) || 0,
//       isEstimated: true, // ⚠️ تقديري لأن السنة السابقة لسه مفتوحة
//     };
//   }
// }



// import {
//   Injectable,
//   BadRequestException,
//   NotFoundException,
//   forwardRef,
//   Inject,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, IsNull } from 'typeorm';
// import { OpeningBalanceEntity } from './entities/opening-balance.entity';
// import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
// import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';
// import { AccountType } from 'src/chart/entities/chart.entity';
// import { ManualOpeningBalanceDto } from './dto/manual-opening-balance.dto';

// @Injectable()
// export class OpeningBalanceService {
//   constructor(
//     @InjectRepository(OpeningBalanceEntity)
//     private readonly openingBalanceRepository: Repository<OpeningBalanceEntity>,

//     @InjectRepository(JournalEntryLineEntity)
//     private readonly journalLineRepository: Repository<JournalEntryLineEntity>,

//     @Inject(forwardRef(() => FiscalYearService))
//     private readonly fiscalYearService: FiscalYearService,
//   ) {}

//   // =========================================================
//   // ✅ توليد الـ Opening Balance تلقائياً من قيود السنة السابقة
//   // بيتستدعى تلقائياً من closeYear — مش من المستخدم مباشرةً
//   // =========================================================
//   // async generate(targetYear: number) {
//   //   const prevYear = targetYear - 1;

//   //   // ✅ تحقق إن السنة السابقة موجودة ومتقفلة
//   //   const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);
//   //   if (!prevFiscalYear) {
//   //     throw new NotFoundException(`Fiscal year ${prevYear} not found`);
//   //   }
//   //   if (!prevFiscalYear.isClosed) {
//   //     throw new BadRequestException(
//   //       `Fiscal year ${prevYear} must be closed before generating opening balance for ${targetYear}`,
//   //     );
//   //   }

//   //   // ✅ تحقق إن السنة الجديدة موجودة
//   //   const targetFiscalYear = await this.fiscalYearService.findOne(targetYear);
//   //   if (!targetFiscalYear) {
//   //     throw new NotFoundException(
//   //       `Fiscal year ${targetYear} not found. Please create it first.`,
//   //     );
//   //   }

//   //   // =========================================================
//   //   // ✅ نجيب سطور القيود من السنة السابقة
//   //   // بس الحسابات الدائمة (Asset, Liability, Equity)
//   //   // ونستبعد قيود الإقفال
//   //   // =========================================================
//   //   const lines = await this.journalLineRepository
//   //     .createQueryBuilder('line')
//   //     .innerJoin('line.journalEntry', 'entry')
//   //     .innerJoin('entry.fiscalYear', 'fy')
//   //     .innerJoin('line.account', 'account')
//   //     .leftJoin('line.costCenter', 'costCenter')
//   //     .select([
//   //       'line.accountId       AS line_accountId',
//   //       'line.debit           AS line_debit',
//   //       'line.credit          AS line_credit',
//   //       'costCenter.id        AS costCenter_id',
//   //     ])
//   //     .where('fy.year = :year', { year: prevYear })
//   //     .andWhere('entry.isClosing = false')
//   //     .andWhere('account.type IN (:...types)', {
//   //       // ✅ إيرادات ومصروفات اتقفلت في closeYear → رصيدها صفر → مش محتاجينها
//   //       types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
//   //     })
//   //     .getRawMany();

//   //   if (!lines.length) {
//   //     return {
//   //       message: `No permanent account balances found for year ${prevYear}`,
//   //       totalAccounts: 0,
//   //     };
//   //   }

//   //   // =========================================================
//   //   // ✅ نجمع الأرصدة على مستوى (حساب + مركز تكلفة)
//   //   // =========================================================
//   //   type BalanceEntry = {
//   //     accountId: number;
//   //     costCenterId: number | null;
//   //     debit: number;
//   //     credit: number;
//   //   };

//   //   const balanceMap = new Map<string, BalanceEntry>();

//   //   for (const line of lines) {
//   //     const accountId = Number(line.line_accountId);
//   //     const costCenterId = line.costCenter_id ? Number(line.costCenter_id) : null;
//   //     const key = `${accountId}_${costCenterId ?? 'null'}`;

//   //     if (!balanceMap.has(key)) {
//   //       balanceMap.set(key, { accountId, costCenterId, debit: 0, credit: 0 });
//   //     }

//   //     const entry = balanceMap.get(key)!;
//   //     entry.debit += parseFloat(line.line_debit) || 0;
//   //     entry.credit += parseFloat(line.line_credit) || 0;
//   //   }

//   //   // =========================================================
//   //   // ✅ نحذف الـ opening balance المولد تلقائياً القديم (إعادة توليد)
//   //   // لكن نحافظ على اللي أدخله المحاسب يدوياً (isGenerated = false)
//   //   // =========================================================
//   //   await this.openingBalanceRepository.delete({
//   //     fiscalYear: { id: targetFiscalYear.id },
//   //     isGenerated: true,
//   //   });

//   //   // =========================================================
//   //   // ✅ نخزن الأرصدة الجديدة
//   //   // =========================================================
//   //   const toSave: OpeningBalanceEntity[] = [];

//   //   for (const [, value] of balanceMap) {
//   //     if (value.debit === 0 && value.credit === 0) continue;

//   //     const ob = this.openingBalanceRepository.create({
//   //       account: { id: value.accountId } as any,
//   //       fiscalYear: { id: targetFiscalYear.id } as any,
//   //       costCenter: value.costCenterId
//   //         ? ({ id: value.costCenterId } as any)
//   //         : null,
//   //       debit: value.debit,
//   //       credit: value.credit,
//   //       isGenerated: true,
//   //     });

//   //     toSave.push(ob);
//   //   }

//   //   await this.openingBalanceRepository.save(toSave);

//   //   return {
//   //     message: `Opening balance for year ${targetYear} generated successfully`,
//   //     totalAccounts: toSave.length,
//   //   };
//   // }


//   async generate(targetYear: number) {
//   const prevYear = targetYear - 1;

//   // ✅ تحقق إن السنة السابقة موجودة ومتقفلة
//   const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);
//   if (!prevFiscalYear) {
//     throw new NotFoundException(`Fiscal year ${prevYear} not found`);
//   }
//   if (!prevFiscalYear.isClosed) {
//     throw new BadRequestException(
//       `Fiscal year ${prevYear} must be closed before generating opening balance for ${targetYear}`,
//     );
//   }

//   // ✅ تحقق إن السنة الجديدة موجودة
//   const targetFiscalYear = await this.fiscalYearService.findOne(targetYear);
//   if (!targetFiscalYear) {
//     throw new NotFoundException(
//       `Fiscal year ${targetYear} not found. Please create it first.`,
//     );
//   }

//   // =========================================================
//   // ✅ نجيب سطور القيود من السنة السابقة
//   // =========================================================
//   const lines = await this.journalLineRepository
//     .createQueryBuilder('line')
//     .innerJoin('line.journalEntry', 'entry')
//     .innerJoin('entry.fiscalYear', 'fy')
//     .innerJoin('line.account', 'account')
//     .leftJoin('line.costCenter', 'costCenter')
//     .select([
//       'account.id      AS accountId',    // ✅ من account مباشرةً
//       'line.debit      AS line_debit',
//       'line.credit     AS line_credit',
//       'costCenter.id   AS costCenterId',
//     ])
//     .where('fy.year = :year', { year: prevYear })
//     .andWhere('entry.isClosing = false')
//     .andWhere('account.type IN (:...types)', {
//       types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
//     })
//     .getRawMany();

//   // ✅ debug مؤقت — تقدر تمسحه بعد ما تتأكد
//   if (lines.length > 0) {
//       console.log('=== DEBUG RAW LINE ===');
//   console.log(JSON.stringify(lines[0], null, 2));
//   console.log('Keys:', Object.keys(lines[0]));
//     console.log('Sample raw line:', lines[0]);
//   }

//   if (!lines.length) {
//     return {
//       message: `No permanent account balances found for year ${prevYear}`,
//       totalAccounts: 0,
//     };
//   }

//   // =========================================================
//   // ✅ نجمع الأرصدة على مستوى (حساب + مركز تكلفة)
//   // =========================================================
//   type BalanceEntry = {
//     accountId: number;
//     costCenterId: number | null;
//     debit: number;
//     credit: number;
//   };

//   const balanceMap = new Map<string, BalanceEntry>();

//   for (const line of lines) {
//     const accountId = Number(line.accountId);
//     const costCenterId = line.costCenterId ? Number(line.costCenterId) : null;

//     // ✅ تجاهل أي سطر فيه accountId غلط
//     if (isNaN(accountId) || accountId === 0) {
//       console.warn('Skipping line with invalid accountId:', line);
//       continue;
//     }

//     const key = `${accountId}_${costCenterId ?? 'null'}`;

//     if (!balanceMap.has(key)) {
//       balanceMap.set(key, { accountId, costCenterId, debit: 0, credit: 0 });
//     }

//     const entry = balanceMap.get(key)!;
//     entry.debit += parseFloat(line.line_debit) || 0;
//     entry.credit += parseFloat(line.line_credit) || 0;
//   }

//   // =========================================================
//   // ✅ نحذف الـ opening balance المولد تلقائياً القديم
//   // =========================================================
//   await this.openingBalanceRepository.delete({
//     fiscalYear: { id: targetFiscalYear.id },
//     isGenerated: true,
//   });

//   // =========================================================
//   // ✅ نخزن الأرصدة الجديدة
//   // =========================================================
//   const toSave: OpeningBalanceEntity[] = [];

//   for (const [, value] of balanceMap) {
//     if (value.debit === 0 && value.credit === 0) continue;

//     const ob = this.openingBalanceRepository.create({
//       account: { id: value.accountId } as any,
//       fiscalYear: { id: targetFiscalYear.id } as any,
//       costCenter: value.costCenterId
//         ? ({ id: value.costCenterId } as any)
//         : null,
//       debit: value.debit,
//       credit: value.credit,
//       isGenerated: true,
//     });

//     toSave.push(ob);
//   }

//   if (!toSave.length) {
//     return {
//       message: `All account balances are zero for year ${prevYear}`,
//       totalAccounts: 0,
//     };
//   }

//   await this.openingBalanceRepository.save(toSave);

//   return {
//     message: `Opening balance for year ${targetYear} generated successfully`,
//     totalAccounts: toSave.length,
//   };
// }



//   // =========================================================
//   // ✅ إدخال يدوي للرصيد الافتتاحي
//   // للحالات الاستثنائية: أول سنة في النظام أو تصحيح يدوي
//   // =========================================================
//   async saveManual(dto: ManualOpeningBalanceDto) {
//     const fy = await this.fiscalYearService.findOne(dto.fiscalYear);
//     if (!fy) {
//       throw new NotFoundException(`Fiscal year ${dto.fiscalYear} not found`);
//     }

//     // ✅ ابحث عن رصيد موجود لنفس (حساب + سنة + مركز تكلفة)
//     const existing = await this.openingBalanceRepository.findOne({
//       where: {
//         account: { id: dto.accountId },
//         fiscalYear: { id: fy.id },
//         costCenter: dto.costCenterId
//           ? { id: dto.costCenterId }
//           : IsNull(),
//       },
//     });

//     if (existing) {
//       // ✅ تحديث الموجود
//       existing.debit = dto.debit;
//       existing.credit = dto.credit;
//       existing.isGenerated = false; // يدوي
//       return this.openingBalanceRepository.save(existing);
//     }

//     // ✅ إنشاء جديد
//     const ob = this.openingBalanceRepository.create({
//       account: { id: dto.accountId } as any,
//       fiscalYear: { id: fy.id } as any,
//       costCenter: dto.costCenterId
//         ? ({ id: dto.costCenterId } as any)
//         : null,
//       debit: dto.debit,
//       credit: dto.credit,
//       isGenerated: false,
//     });

//     return this.openingBalanceRepository.save(ob);
//   }

//   // =========================================================
//   // ✅ جيب الـ Opening Balance لحساب معين في سنة معينة
//   // =========================================================
//   async getForAccount(
//     accountId: number,
//     fiscalYear: number,
//     costCenterId?: number,
//   ) {
//     const where: any = {
//       account: { id: accountId },
//       fiscalYear: { year: fiscalYear },
//     };

//     if (costCenterId !== undefined) {
//       where.costCenter = { id: costCenterId };
//     }

//     const results = await this.openingBalanceRepository.find({ where });

//     const totalDebit = results.reduce(
//       (sum, r) => sum + parseFloat(r.debit as any),
//       0,
//     );
//     const totalCredit = results.reduce(
//       (sum, r) => sum + parseFloat(r.credit as any),
//       0,
//     );

//     return {
//       accountId,
//       fiscalYear,
//       costCenterId: costCenterId ?? null,
//       openingDebit: totalDebit,
//       openingCredit: totalCredit,
//       netBalance: totalDebit - totalCredit,
//     };
//   }

//   // =========================================================
//   // ✅ جيب كل الأرصدة الافتتاحية لسنة معينة
//   // =========================================================
//   async findAllForYear(year: number) {
//     return this.openingBalanceRepository.find({
//       where: { fiscalYear: { year } },
//       relations: ['account', 'costCenter', 'fiscalYear'],
//       order: { account: { id: 'ASC' } },
//     });
//   }

//   // =========================================================
//   // ✅ جيب الـ Opening Balance لتقرير الأستاذ
//   // بيراعي لو السنة السابقة مفتوحة → يحسب on-the-fly
//   // =========================================================
//   // async getOpeningBalanceForLedger(
//   //   accountId: number,
//   //   fiscalYear: number,
//   //   costCenterId?: number,
//   // ): Promise<{
//   //   openingDebit: number;
//   //   openingCredit: number;
//   //   isEstimated: boolean;
//   // }> {
//   //   const prevYear = fiscalYear - 1;
//   //   const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);

//   //   // ✅ لو مفيش سنة سابقة (أول سنة) → نرجع الرصيد المدخل يدوياً
//   //   if (!prevFiscalYear) {
//   //     const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
//   //     return {
//   //       openingDebit: result.openingDebit,
//   //       openingCredit: result.openingCredit,
//   //       isEstimated: false,
//   //     };
//   //   }

//   //   // ✅ السنة السابقة متقفلة → نرجع الرصيد المخزون
//   //   if (prevFiscalYear.isClosed) {
//   //     const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
//   //     return {
//   //       openingDebit: result.openingDebit,
//   //       openingCredit: result.openingCredit,
//   //       isEstimated: false,
//   //     };
//   //   }

//   //   // ⚠️ السنة السابقة مفتوحة → نحسب on-the-fly من القيود
//   //   const qb = this.journalLineRepository
//   //     .createQueryBuilder('line')
//   //     .innerJoin('line.journalEntry', 'entry')
//   //     .innerJoin('entry.fiscalYear', 'fy')
//   //     .innerJoin('line.account', 'account')
//   //     .where('fy.year = :prevYear', { prevYear })
//   //     .andWhere('line.account = :accountId', { accountId })
//   //     .andWhere('entry.isClosing = false')
//   //     .andWhere('account.type IN (:...types)', {
//   //       types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
//   //     });

//   //   if (costCenterId !== undefined) {
//   //     qb.andWhere('line.costCenter = :costCenterId', { costCenterId });
//   //   } else {
//   //     qb.andWhere('line.costCenter IS NULL');
//   //   }

//   //   const result = await qb
//   //     .select([
//   //       'COALESCE(SUM(line.debit), 0)  AS totalDebit',
//   //       'COALESCE(SUM(line.credit), 0) AS totalCredit',
//   //     ])
//   //     .getRawOne();

//   //   return {
//   //     openingDebit: parseFloat(result?.totalDebit) || 0,
//   //     openingCredit: parseFloat(result?.totalCredit) || 0,
//   //     isEstimated: true, // ⚠️ تقديري — السنة السابقة لسه مفتوحة
//   //   };
//   // }

//   async getOpeningBalanceForLedger(
//   accountId: number,
//   fiscalYear: number,
//   costCenterId?: number,
// ): Promise<{
//   openingDebit: number;
//   openingCredit: number;
//   isEstimated: boolean;
// }> {
//   const prevYear = fiscalYear - 1;
//   const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);

//   // ✅ أول سنة في النظام → مفيش سنة سابقة خالص
//   // رصيد = الأرصدة المدخلة يدوياً لو موجودة، أو صفر
//   if (!prevFiscalYear) {
//     const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
//     return {
//       openingDebit: result.openingDebit,
//       openingCredit: result.openingCredit,
//       isEstimated: false, // ✅ مش تقديري — ده فعلاً الرصيد الحقيقي أو صفر
//     };
//   }

//   // ✅ السنة السابقة متقفلة → من الجدول مباشرةً (سريع وموثوق)
//   if (prevFiscalYear.isClosed) {
//     const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
//     return {
//       openingDebit: result.openingDebit,
//       openingCredit: result.openingCredit,
//       isEstimated: false,
//     };
//   }

//   // ⚠️ السنة السابقة مفتوحة → on-the-fly من القيود
//   // بس الحسابات الدائمة (Asset, Liability, Equity)
//   const qb = this.journalLineRepository
//     .createQueryBuilder('line')
//     .innerJoin('line.journalEntry', 'entry')
//     .innerJoin('entry.fiscalYear', 'fy')
//     .innerJoin('line.account', 'account')
//     .where('fy.year = :prevYear', { prevYear })
//     .andWhere('line.account = :accountId', { accountId })
//     .andWhere('entry.isClosing = false')
//     .andWhere('account.type IN (:...types)', {
//       types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
//     });

//   if (costCenterId !== undefined) {
//     qb.andWhere('line.costCenter = :costCenterId', { costCenterId });
//   } else {
//     qb.andWhere('line.costCenter IS NULL');
//   }

//   const result = await qb
//     .select([
//       'COALESCE(SUM(line.debit), 0)  AS totalDebit',
//       'COALESCE(SUM(line.credit), 0) AS totalCredit',
//     ])
//     .getRawOne();

//   return {
//     openingDebit: parseFloat(result?.totalDebit) || 0,
//     openingCredit: parseFloat(result?.totalCredit) || 0,
//     isEstimated: true, // ⚠️ تقديري — السنة السابقة لسه مفتوحة
//   };
// }
// }



import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { OpeningBalanceEntity } from './entities/opening-balance.entity';
import { JournalEntryLineEntity } from 'src/journal-entries/entities/journal-entry.entity';
import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';
import { AccountType } from 'src/chart/entities/chart.entity';
import { ManualOpeningBalanceDto } from './dto/manual-opening-balance.dto';

@Injectable()
export class OpeningBalanceService {
  constructor(
    @InjectRepository(OpeningBalanceEntity)
    private readonly openingBalanceRepository: Repository<OpeningBalanceEntity>,

    @InjectRepository(JournalEntryLineEntity)
    private readonly journalLineRepository: Repository<JournalEntryLineEntity>,

    @Inject(forwardRef(() => FiscalYearService))
    private readonly fiscalYearService: FiscalYearService,
  ) {}

  // =========================================================
  // ✅ توليد الـ Opening Balance تلقائياً من قيود السنة السابقة
  // بيتستدعى تلقائياً من closeYear — مش من المستخدم مباشرةً
  // =========================================================
  async generate(targetYear: number) {
    const prevYear = targetYear - 1;

    // ✅ تحقق إن السنة السابقة موجودة ومتقفلة
    const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);
    if (!prevFiscalYear) {
      throw new NotFoundException(`Fiscal year ${prevYear} not found`);
    }
    if (!prevFiscalYear.isClosed) {
      throw new BadRequestException(
        `Fiscal year ${prevYear} must be closed before generating opening balance for ${targetYear}`,
      );
    }

    // ✅ تحقق إن السنة الجديدة موجودة
    const targetFiscalYear = await this.fiscalYearService.findOne(targetYear);
    if (!targetFiscalYear) {
      throw new NotFoundException(
        `Fiscal year ${targetYear} not found. Please create it first.`,
      );
    }

    // =========================================================
    // ✅ نجيب سطور القيود من السنة السابقة
    // بس الحسابات الدائمة (Asset, Liability, Equity)
    // ونستبعد قيود الإقفال
    // ✅ الـ double quotes ضرورية عشان PostgreSQL يحافظ على الـ case
    // =========================================================
    const lines = await this.journalLineRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('entry.fiscalYear', 'fy')
      .innerJoin('line.account', 'account')
      .leftJoin('line.costCenter', 'costCenter')
      .select([
        'account.id    AS "accountId"',
        'line.debit    AS "lineDebit"',
        'line.credit   AS "lineCredit"',
        'costCenter.id AS "costCenterId"',
      ])
      .where('fy.year = :year', { year: prevYear })
      .andWhere('entry.isClosing = false')
      .andWhere('account.type IN (:...types)', {
        types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
      })
      .getRawMany();

    if (!lines.length) {
      return {
        message: `No permanent account balances found for year ${prevYear}`,
        totalAccounts: 0,
      };
    }

    // =========================================================
    // ✅ نجمع الأرصدة على مستوى (حساب + مركز تكلفة)
    // =========================================================
    type BalanceEntry = {
      accountId: number;
      costCenterId: number | null;
      debit: number;
      credit: number;
    };

    const balanceMap = new Map<string, BalanceEntry>();

    for (const line of lines) {
      const accountId   = Number(line.accountId);
      const costCenterId = line.costCenterId ? Number(line.costCenterId) : null;

      if (isNaN(accountId) || accountId === 0) continue;

      const key = `${accountId}_${costCenterId ?? 'null'}`;

      if (!balanceMap.has(key)) {
        balanceMap.set(key, { accountId, costCenterId, debit: 0, credit: 0 });
      }

      const entry = balanceMap.get(key)!;
      entry.debit  += parseFloat(line.lineDebit)  || 0;
      entry.credit += parseFloat(line.lineCredit) || 0;
    }

    // =========================================================
    // ✅ نحذف الـ opening balance المولد تلقائياً القديم (إعادة توليد)
    // لكن نحافظ على اللي أدخله المحاسب يدوياً (isGenerated = false)
    // =========================================================
    await this.openingBalanceRepository.delete({
      fiscalYear: { id: targetFiscalYear.id },
      isGenerated: true,
    });

    // =========================================================
    // ✅ نخزن الأرصدة الجديدة
    // =========================================================
    const toSave: OpeningBalanceEntity[] = [];

    for (const [, value] of balanceMap) {
      if (value.debit === 0 && value.credit === 0) continue;

      const ob = this.openingBalanceRepository.create({
        account:    { id: value.accountId } as any,
        fiscalYear: { id: targetFiscalYear.id } as any,
        costCenter: value.costCenterId ? ({ id: value.costCenterId } as any) : null,
        debit:      value.debit,
        credit:     value.credit,
        isGenerated: true,
      });

      toSave.push(ob);
    }

    if (!toSave.length) {
      return {
        message: `All account balances are zero for year ${prevYear}`,
        totalAccounts: 0,
      };
    }

    await this.openingBalanceRepository.save(toSave);

    return {
      message: `Opening balance for year ${targetYear} generated successfully`,
      totalAccounts: toSave.length,
    };
  }

  // =========================================================
  // ✅ إدخال يدوي للرصيد الافتتاحي
  // للحالات الاستثنائية: أول سنة في النظام أو تصحيح يدوي
  // =========================================================
  async saveManual(dto: ManualOpeningBalanceDto) {
    const fy = await this.fiscalYearService.findOne(dto.fiscalYear);
    if (!fy) {
      throw new NotFoundException(`Fiscal year ${dto.fiscalYear} not found`);
    }

    // ✅ ابحث عن رصيد موجود لنفس (حساب + سنة + مركز تكلفة)
    const existing = await this.openingBalanceRepository.findOne({
      where: {
        account:    { id: dto.accountId },
        fiscalYear: { id: fy.id },
        costCenter: dto.costCenterId ? { id: dto.costCenterId } : IsNull(),
      },
    });

    if (existing) {
      existing.debit       = dto.debit;
      existing.credit      = dto.credit;
      existing.isGenerated = false;
      return this.openingBalanceRepository.save(existing);
    }

    const ob = this.openingBalanceRepository.create({
      account:    { id: dto.accountId } as any,
      fiscalYear: { id: fy.id } as any,
      costCenter: dto.costCenterId ? ({ id: dto.costCenterId } as any) : null,
      debit:      dto.debit,
      credit:     dto.credit,
      isGenerated: false,
    });

    return this.openingBalanceRepository.save(ob);
  }

  // =========================================================
  // ✅ جيب الـ Opening Balance لحساب معين في سنة معينة
  // =========================================================
  async getForAccount(
    accountId: number,
    fiscalYear: number,
    costCenterId?: number,
  ) {
    const where: any = {
      account:    { id: accountId },
      fiscalYear: { year: fiscalYear },
    };

    if (costCenterId !== undefined) {
      where.costCenter = { id: costCenterId };
    }

    const results = await this.openingBalanceRepository.find({ where });

    const totalDebit  = results.reduce((sum, r) => sum + parseFloat(r.debit  as any), 0);
    const totalCredit = results.reduce((sum, r) => sum + parseFloat(r.credit as any), 0);

    return {
      accountId,
      fiscalYear,
      costCenterId:   costCenterId ?? null,
      openingDebit:   totalDebit,
      openingCredit:  totalCredit,
      netBalance:     totalDebit - totalCredit,
    };
  }

  // =========================================================
  // ✅ جيب كل الأرصدة الافتتاحية لسنة معينة
  // =========================================================
  async findAllForYear(year: number) {
    return this.openingBalanceRepository.find({
      where:     { fiscalYear: { year } },
      relations: ['account', 'costCenter', 'fiscalYear'],
      order:     { account: { id: 'ASC' } },
    });
  }

  // =========================================================
  // ✅ جيب الـ Opening Balance لتقرير الأستاذ
  // بيراعي لو السنة السابقة مفتوحة → يحسب on-the-fly
  // =========================================================
  async getOpeningBalanceForLedger(
    accountId: number,
    fiscalYear: number,
    costCenterId?: number,
  ): Promise<{
    openingDebit: number;
    openingCredit: number;
    isEstimated: boolean;
  }> {
    const prevYear      = fiscalYear - 1;
    const prevFiscalYear = await this.fiscalYearService.findOne(prevYear);

    // ✅ أول سنة في النظام → مفيش سنة سابقة خالص
    if (!prevFiscalYear) {
      const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
      return {
        openingDebit:  result.openingDebit,
        openingCredit: result.openingCredit,
        isEstimated:   false,
      };
    }

    // ✅ السنة السابقة متقفلة → من الجدول مباشرةً (سريع وموثوق)
    if (prevFiscalYear.isClosed) {
      const result = await this.getForAccount(accountId, fiscalYear, costCenterId);
      return {
        openingDebit:  result.openingDebit,
        openingCredit: result.openingCredit,
        isEstimated:   false,
      };
    }

    // ⚠️ السنة السابقة مفتوحة → on-the-fly من القيود
    const qb = this.journalLineRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .innerJoin('entry.fiscalYear', 'fy')
      .innerJoin('line.account', 'account')
      .where('fy.year = :prevYear', { prevYear })
      .andWhere('line.account = :accountId', { accountId })
      .andWhere('entry.isClosing = false')
      .andWhere('account.type IN (:...types)', {
        types: [AccountType.Asset, AccountType.Liability, AccountType.Equity],
      });

    if (costCenterId !== undefined) {
      qb.andWhere('line.costCenter = :costCenterId', { costCenterId });
    } else {
      qb.andWhere('line.costCenter IS NULL');
    }

    const result = await qb
      .select([
        'COALESCE(SUM(line.debit), 0)  AS "totalDebit"',
        'COALESCE(SUM(line.credit), 0) AS "totalCredit"',
      ])
      .getRawOne();

    return {
      openingDebit:  parseFloat(result?.totalDebit)  || 0,
      openingCredit: parseFloat(result?.totalCredit) || 0,
      isEstimated:   true,
    };
  }
}
