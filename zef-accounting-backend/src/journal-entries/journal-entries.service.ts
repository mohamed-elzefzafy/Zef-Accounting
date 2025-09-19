import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JwtPayloadType } from 'src/shared/types';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from './entities/journal-entry.entity';
import { AccountEntity } from 'src/chart/entities/chart.entity';
import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntryEntity)
    private readonly journalEntryRepository: Repository<JournalEntryEntity>,

    @InjectRepository(JournalEntryLineEntity)
    private readonly journalEntryLineRepository: Repository<JournalEntryLineEntity>,

    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly fiscalYearService: FiscalYearService,
  ) {}

  // async create(dto: CreateJournalEntryDto, user: JwtPayloadType) {
  //   // validation: مينفعش نفس السطر يبقى فيه debit & credit
  //   dto.entries.forEach((line) => {
  //     if (line.debit && line.credit) {
  //       throw new BadRequestException(
  //         'An entry line cannot have both debit and credit amounts.',
  //       );
  //     }
  //   });

  //   const entryDate = new Date(dto.date);

  //   // نحدد بداية ونهاية الشهر
  //   const startOfMonth = new Date(
  //     entryDate.getFullYear(),
  //     entryDate.getMonth(),
  //     1,
  //   );
  //   const endOfMonth = new Date(
  //     entryDate.getFullYear(),
  //     entryDate.getMonth() + 1,
  //     0,
  //   );

  //   // نجيب آخر قيد فى نفس الشهر
  //   const lastEntry = await this.journalEntryModel
  //     .findOne({
  //       date: { $gte: startOfMonth, $lte: endOfMonth },
  //     })
  //     .sort({ sequenceNumber: -1 })
  //     .exec();

  //   const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

  //   const entry = new this.journalEntryModel({
  //     date: entryDate,
  //     description: dto.description,
  //     entries: dto.entries.map((line) => ({
  //       account: new Types.ObjectId(line.account),
  //       debit: line.debit || 0,
  //       credit: line.credit || 0,
  //       costCenter: line.costCenter
  //         ? new Types.ObjectId(line.costCenter)
  //         : null,
  //     })),
  //     sequenceNumber: nextSeq,
  //     code: `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${nextSeq}`,
  //     createdBy: new Types.ObjectId(user.id),
  //     lastModifiedBy: new Types.ObjectId(user.id),
  //   });

  //   return entry.save();
  // }

  // async create(dto: CreateJournalEntryDto, user: JwtPayloadType) {
  //   // ✅ validation: مينفعش نفس السطر يبقى فيه debit & credit
  //   dto.entries.forEach((line) => {
  //     if (line.debit && line.credit) {
  //       throw new BadRequestException(
  //         'An entry line cannot have both debit and credit amounts.',
  //       );
  //     }
  //   });

  //   const entryDate = new Date(dto.date);

  //   // ✅ بداية ونهاية الشهر
  //   const startOfMonth = new Date(
  //     entryDate.getFullYear(),
  //     entryDate.getMonth(),
  //     1,
  //   );
  //   const endOfMonth = new Date(
  //     entryDate.getFullYear(),
  //     entryDate.getMonth() + 1,
  //     0,
  //   );

  //   // ✅ نجيب آخر قيد في نفس الشهر
  //   const lastEntry = await this.journalEntryRepository
  //     .createQueryBuilder('entry')
  //     .where('entry.date BETWEEN :start AND :end', {
  //       start: startOfMonth,
  //       end: endOfMonth,
  //     })
  //     .orderBy('entry.sequenceNumber', 'DESC')
  //     .getOne();

  //   const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

  //   // ✅ نجهز الكيان
  //   const entry = this.journalEntryRepository.create({
  //     date: entryDate,
  //     description: dto.description,
  //     sequenceNumber: nextSeq,
  //     code: `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}-${nextSeq}`,
  //     createdBy: { id: user.id } as any, // لو الـ UserEntity معرف بـ id: string خليها string
  //     lastModifiedBy: { id: user.id } as any,
  //     entries: dto.entries.map((line) =>
  //       this.journalEntryLineRepository.create({
  //         account: { id: line.account } as any,
  //         debit: line.debit || 0,
  //         credit: line.credit || 0,
  //         costCenter: line.costCenter ? ({ id: line.costCenter } as any) : null,
  //       }),
  //     ),
  //   });

  //   // ✅ نحفظ
  //   return await this.journalEntryRepository.save(entry);
  // }

  async create(dto: CreateJournalEntryDto, user: JwtPayloadType) {
  // ✅ validation: مينفعش نفس السطر يبقى فيه debit & credit
  dto.entries.forEach((line) => {
    if (line.debit && line.credit) {
      throw new BadRequestException(
        'An entry line cannot have both debit and credit amounts.',
      );
    }
  });

  const entryDate = new Date(dto.date);
  const year = entryDate.getFullYear();

  // ✅ check السنة المالية
  const fiscalYear = await this.fiscalYearService.findOne(year);
  if (!fiscalYear) {
    throw new BadRequestException(
      `Fiscal year ${year} is not created. Please create it first.`,
    );
  }
  if (fiscalYear.isClosed) {
    throw new BadRequestException(`Fiscal year ${year} is already closed`);
  }

  // ✅ بداية ونهاية الشهر
  const startOfMonth = new Date(year, entryDate.getMonth(), 1);
  const endOfMonth = new Date(year, entryDate.getMonth() + 1, 0);

  // ✅ نجيب آخر قيد في نفس الشهر
  const lastEntry = await this.journalEntryRepository
    .createQueryBuilder('entry')
    .where('entry.date BETWEEN :start AND :end', {
      start: startOfMonth,
      end: endOfMonth,
    })
    .orderBy('entry.sequenceNumber', 'DESC')
    .getOne();

  const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;

  // ✅ نجهز الكيان
  const entry = this.journalEntryRepository.create({
    date: entryDate,
    description: dto.description,
    sequenceNumber: nextSeq,
    code: `${year}-${entryDate.getMonth() + 1}-${nextSeq}`,
    createdBy: { id: user.id } as any,
    lastModifiedBy: { id: user.id } as any,
    entries: dto.entries.map((line) =>
      this.journalEntryLineRepository.create({
        account: { id: line.account } as any,
        debit: line.debit || 0,
        credit: line.credit || 0,
        costCenter: line.costCenter ? ({ id: line.costCenter } as any) : null,
      }),
    ),
  });

  // ✅ نحفظ
  return await this.journalEntryRepository.save(entry);
}


  // 📌 Find all
  // async findAll() {
  //   return this.journalEntryModel
  //     .find()
  //     .populate('entries.account')
  //     .populate('entries.costCenter')
  //     .populate('createdBy')
  //     .populate('lastModifiedBy')
  //     .exec();
  // }

  async findAll() {
    return this.journalEntryRepository.find({
      relations: [
        'entries',
        'entries.account',
        'entries.costCenter',
        'createdBy',
        'lastModifiedBy',
      ],
      order: {
        date: 'ASC', // لو عايز الترتيب حسب التاريخ (اختياري)
      },
    });
  }

  // 📌 Find one
  // async findOne(id: string) {
  //   const entry = await this.journalEntryModel
  //     .findById(id)
  //     .populate('entries.account')
  //     .populate('entries.costCenter')
  //     .populate('createdBy')
  //     .populate('lastModifiedBy')
  //     .exec();

  //   if (!entry) {
  //     throw new NotFoundException('Journal entry not found');
  //   }

  //   return entry;
  // }

  async findOne(id: number) {
    const entry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: [
        'entries',
        'entries.account',
        'entries.costCenter',
        'createdBy',
        'lastModifiedBy',
      ],
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  // async reorderAll() {
  //   const entries = await this.journalEntryModel
  //     .find()
  //     .sort({ date: 1 })
  //     .exec();

  //   // نعمل جروب حسب الشهر والسنة
  //   const grouped: Record<string, JournalEntryDocument[]> = {};
  //   for (const e of entries) {
  //     const key = `${e.date.getFullYear()}-${e.date.getMonth() + 1}`;
  //     if (!grouped[key]) grouped[key] = [];
  //     grouped[key].push(e);
  //   }

  //   // نعيد الترتيب داخل كل جروب
  //   for (const key of Object.keys(grouped)) {
  //     const group = grouped[key].sort(
  //       (a, b) => a.date.getTime() - b.date.getTime(),
  //     );
  //     let seq = 1;
  //     for (const entry of group) {
  //       entry.sequenceNumber = seq++;
  //       entry.code = `${entry.date.getFullYear()}-${entry.date.getMonth() + 1}-${entry.sequenceNumber}`;
  //       await entry.save();
  //     }
  //   }

  //   return { message: 'All journal entries reordered successfully' };
  // }

  async reorderAll() {
    // نجيب كل القيود مرتبة حسب التاريخ
    const entries = await this.journalEntryRepository.find({
      order: { date: 'ASC' },
    });

    // جروب حسب السنة والشهر
    const grouped: Record<string, JournalEntryEntity[]> = {};
    for (const e of entries) {
      const key = `${e.date.getFullYear()}-${e.date.getMonth() + 1}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(e);
    }

    // نعيد الترتيب داخل كل جروب
    for (const key of Object.keys(grouped)) {
      const group = grouped[key].sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );

      let seq = 1;
      for (const entry of group) {
        entry.sequenceNumber = seq++;
        entry.code = `${entry.date.getFullYear()}-${entry.date.getMonth() + 1}-${entry.sequenceNumber}`;
        await this.journalEntryRepository.save(entry);
      }
    }

    return { message: 'All journal entries reordered successfully' };
  }

  // async update(id: string, dto: UpdateJournalEntryDto, user: JwtPayloadType) {
  //   const entry = await this.journalEntryModel.findById(id).exec();
  //   if (!entry) {
  //     throw new NotFoundException('Journal entry not found');
  //   }

  //   // validation: ممنوع line فيه debit & credit
  //   if (dto.entries) {
  //     dto.entries.forEach((line) => {
  //       if (line.debit && line.credit) {
  //         throw new BadRequestException(
  //           'An entry line cannot have both debit and credit amounts.',
  //         );
  //       }
  //     });
  //   }

  //   if (dto.date) {
  //     entry.date = new Date(dto.date);

  //     // لو التاريخ اتغير لازم نعيد تسلسل القيد الجديد
  //     const startOfMonth = new Date(
  //       entry.date.getFullYear(),
  //       entry.date.getMonth(),
  //       1,
  //     );
  //     const endOfMonth = new Date(
  //       entry.date.getFullYear(),
  //       entry.date.getMonth() + 1,
  //       0,
  //     );

  //     const lastEntry = await this.journalEntryModel
  //       .findOne({
  //         _id: { $ne: entry._id }, // نستبعد القيد الحالى
  //         date: { $gte: startOfMonth, $lte: endOfMonth },
  //       })
  //       .sort({ sequenceNumber: -1 })
  //       .exec();

  //     const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;
  //     entry.sequenceNumber = nextSeq;
  //     entry.code = `${entry.date.getFullYear()}-${entry.date.getMonth() + 1}-${nextSeq}`;
  //   }

  //   if (dto.description) entry.description = dto.description;

  //   if (dto.entries) {
  //     entry.entries = dto.entries.map((line) => ({
  //       account: new Types.ObjectId(line.account),
  //       debit: line.debit || 0,
  //       credit: line.credit || 0,
  //       costCenter: line.costCenter
  //         ? new Types.ObjectId(line.costCenter)
  //         : null,
  //     }));
  //   }

  //   entry.lastModifiedBy = new Types.ObjectId(user.id);

  //   return entry.save();
  // }

  // 📌 Delete
  // async remove(id: string) {
  //   const result = await this.journalEntryModel.findByIdAndDelete(id).exec();
  //   if (!result) {
  //     throw new NotFoundException('Journal entry not found');
  //   }
  //   return { message: 'Journal entry deleted successfully' };
  // }

  async update(id: number, dto: UpdateJournalEntryDto, user: JwtPayloadType) {
    const entry = await this.journalEntryRepository.findOne({
      where: { id },
      relations: ['entries', 'entries.account', 'entries.costCenter'],
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    // ✅ validation: ممنوع line يبقى فيه debit & credit
    if (dto.entries) {
      dto.entries.forEach((line) => {
        if (line.debit && line.credit) {
          throw new BadRequestException(
            'An entry line cannot have both debit and credit amounts.',
          );
        }
      });
    }

    // ✅ تحديث التاريخ وإعادة الترقيم لو التاريخ اتغير
    if (dto.date) {
      entry.date = new Date(dto.date);

      const startOfMonth = new Date(
        entry.date.getFullYear(),
        entry.date.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        entry.date.getFullYear(),
        entry.date.getMonth() + 1,
        0,
      );

      // نجيب آخر قيد فى نفس الشهر (مع استبعاد القيد الحالي)
      const lastEntry = await this.journalEntryRepository.findOne({
        where: {
          id: Not(id), // 👈 exclude current entry
          date: Between(startOfMonth, endOfMonth),
        },
        order: { sequenceNumber: 'DESC' },
      });

      const nextSeq = lastEntry ? lastEntry.sequenceNumber + 1 : 1;
      entry.sequenceNumber = nextSeq;
      entry.code = `${entry.date.getFullYear()}-${entry.date.getMonth() + 1}-${nextSeq}`;
    }

    if (dto.description) {
      entry.description = dto.description;
    }

    // ✅ تحديث الـ entries
    if (dto.entries) {
      entry.entries = dto.entries.map((line) => {
        const entryLine = new JournalEntryLineEntity();
        entryLine.account = { id: line.account } as any; // reference by id
        entryLine.debit = line.debit || 0;
        entryLine.credit = line.credit || 0;
        entryLine.costCenter = line.costCenter
          ? ({ id: line.costCenter } as any)
          : null;
        return entryLine;
      });
    }

    entry.lastModifiedBy = { id: user.id } as any;

    return this.journalEntryRepository.save(entry);
  }

  // async remove(id: string) {
  //   const entry = await this.journalEntryModel.findByIdAndDelete(id).exec();

  //   if (!entry) {
  //     throw new NotFoundException('Journal entry not found');
  //   }

  //   // بعد ما نحذف القيد: نجيب كل القيود فى نفس الشهر ونرتبهم
  //   const year = entry.date.getUTCFullYear();
  //   const month = entry.date.getUTCMonth(); // 0-based

  //   const entriesInMonth = await this.journalEntryModel
  //     .find({
  //       date: {
  //         $gte: new Date(Date.UTC(year, month, 1)),
  //         $lte: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59)),
  //       },
  //     })
  //     .sort({ date: 1, createdAt: 1 }) // ترتيب حسب التاريخ ثم وقت الإنشاء
  //     .exec();

  //   // إعادة الترقيم من 1 لحد آخر قيد
  //   for (let i = 0; i < entriesInMonth.length; i++) {
  //     entriesInMonth[i].sequenceNumber = i + 1;
  //     await entriesInMonth[i].save();
  //   }

  //   return {
  //     message: 'Journal entry deleted successfully and sequence reordered',
  //   };
  // }

  async remove(id: number) {
    const entry = await this.journalEntryRepository.findOne({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    // نحذف القيد
    await this.journalEntryRepository.remove(entry);

    // بعد ما نحذف القيد: نجيب كل القيود فى نفس الشهر ونرتبهم
    const year = entry.date.getUTCFullYear();
    const month = entry.date.getUTCMonth(); // 0-based

    const startOfMonth = new Date(Date.UTC(year, month, 1));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    const entriesInMonth = await this.journalEntryRepository.find({
      where: {
        date: Between(startOfMonth, endOfMonth),
      },
      order: {
        date: 'ASC',
        createdAt: 'ASC',
      },
    });

    // إعادة الترقيم من 1 لحد آخر قيد
    for (let i = 0; i < entriesInMonth.length; i++) {
      entriesInMonth[i].sequenceNumber = i + 1;
      entriesInMonth[i].code =
        `${entriesInMonth[i].date.getFullYear()}-${entriesInMonth[i].date.getMonth() + 1}-${i + 1}`;
      await this.journalEntryRepository.save(entriesInMonth[i]);
    }

    return {
      message: 'Journal entry deleted successfully and sequence reordered',
    };
  }

  // async closeYear(year: number) {

  //   // 1. نجيب كل القيود الخاصة بالسنة
  //   const start = new Date(`${year}-01-01`);
  //   const end = new Date(`${year}-12-31`);

  //   const entries = await this.journalEntryModel.find({
  //     date: { $gte: start, $lte: end },
  //   });

  //   if (!entries.length) {
  //     throw new NotFoundException(`No entries found for year ${year}`);
  //   }

  //   // 2. نحسب إجمالي الإيرادات والمصروفات
  //   let totalRevenue = 0;
  //   let totalExpense = 0;

  //   for (const entry of entries) {
  //     for (const line of entry.entries) {
  //       // بافتراض عندك حسابات مميزة بالكود أو الـtype
  //       if ((line.account as any).type === 'REVENUE') {
  //         totalRevenue += line.credit - line.debit;
  //       }
  //       if ((line.account as any).type === 'EXPENSE') {
  //         totalExpense += line.debit - line.credit;
  //       }
  //     }
  //   }

  //   const income = totalRevenue - totalExpense;

  //   // 3. نعمل قيد إقفال
  //   const closingEntry = new this.journalEntryModel({
  //     date: end,
  //     description: `Closing entry for year ${year}`,
  //     entries: [
  //       { account: 'income_summary', debit: totalRevenue, credit: 0 },
  //       { account: 'income_summary', debit: 0, credit: totalExpense },
  //       income >= 0
  //         ? { account: 'retained_earnings', debit: 0, credit: income }
  //         : { account: 'retained_earnings', debit: -income, credit: 0 },
  //     ],
  //   });

  //   await closingEntry.save();

  //   return { message: 'Year closed successfully', year, income };
  // }

  // 🔹 قيد افتتاح السنة الجديدة



  // async openYear(newYear: number) {
  //   const prevYear = newYear - 1;
  //   const endPrev = new Date(`${prevYear}-12-31`);

  //   // نجيب آخر أرصدة السنة الماضية
  //   const accounts = await this.journalEntryModel.aggregate([
  //     { $match: { date: { $lte: endPrev } } },
  //     { $unwind: '$entries' },
  //     {
  //       $group: {
  //         _id: '$entries.account',
  //         debit: { $sum: '$entries.debit' },
  //         credit: { $sum: '$entries.credit' },
  //       },
  //     },
  //     {
  //       $project: {
  //         balance: { $subtract: ['$debit', '$credit'] },
  //       },
  //     },
  //   ]);

  //   if (!accounts.length) {
  //     throw new NotFoundException(`No balances found for year ${prevYear}`);
  //   }

  //   // نعمل قيد افتتاح
  //   const openingEntry = new this.journalEntryModel({
  //     date: new Date(`${newYear}-01-01`),
  //     description: `Opening entry for year ${newYear}`,
  //     entries: accounts.map((acc) => ({
  //       account: acc._id,
  //       debit: acc.balance > 0 ? acc.balance : 0,
  //       credit: acc.balance < 0 ? -acc.balance : 0,
  //     })),
  //   });

  //   await openingEntry.save();

  //   return { message: 'Opening entry created', newYear };
  // }

  //   async openYear(newYear: number): Promise<{ message: string; newYear: number }> {
  //   const prevYear = newYear - 1;
  //   const endPrev = new Date(`${prevYear}-12-31`);

  //   // نجيب آخر أرصدة السنة الماضية
  //   const accounts: {
  //     _id: string;
  //     debit: number;
  //     credit: number;
  //     balance: number;
  //   }[] = await this.journalEntryRepository.aggregate([
  //     { $match: { date: { $lte: endPrev } } },
  //     { $unwind: '$entries' },
  //     {
  //       $group: {
  //         _id: '$entries.account',
  //         debit: { $sum: '$entries.debit' },
  //         credit: { $sum: '$entries.credit' },
  //       },
  //     },
  //     {
  //       $project: {
  //         debit: 1,
  //         credit: 1,
  //         balance: { $subtract: ['$debit', '$credit'] },
  //       },
  //     },
  //   ]);

  //   if (!accounts.length) {
  //     throw new NotFoundException(`No balances found for year ${prevYear}`);
  //   }

  //   // نعمل قيد افتتاح
  //   const openingEntry = new this.journalEntryModel({
  //     date: new Date(`${newYear}-01-01`),
  //     description: `Opening entry for year ${newYear}`,
  //     entries: accounts.map((acc) => ({
  //       account: acc._id,
  //       debit: acc.balance > 0 ? acc.balance : 0,
  //       credit: acc.balance < 0 ? -acc.balance : 0,
  //     })),
  //   });

  //   await openingEntry.save();

  //   return { message: 'Opening entry created', newYear };
  // }


}
