import { Injectable, NotFoundException } from '@nestjs/common';
import {JournalEntryEntity} from '../journal-entries/entities/journal-entry.entity';
import { GetLedgerDto } from './dto/get-ledger.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectRepository(JournalEntryEntity)
    private readonly journalEntryRepository: Repository<JournalEntryEntity>,
  ) {}




  // async getGeneralLedger(dto: GetLedgerDto) {
  //   const { accountId, startDate, endDate, costCenter } = dto;

  //   const accountObjectId = new Types.ObjectId(accountId);

  //   // Base query
  //   const query: any = {
  //     date: {
  //       $gte: new Date(startDate as string),
  //       $lte: new Date(endDate as string),
  //     },
  //     'entries.account': accountObjectId,
  //   };

  //   if (costCenter) {
  //     query['entries.costCenter'] = new Types.ObjectId(costCenter);
  //   }

  //   const journalEntries = await this.journalEntryModel
  //     .find(query)
  //     .populate('entries.account')
  //     .populate('entries.costCenter')
  //     .sort({ date: 1, sequenceNumber: 1 }) // ⬅️ الأول بالتاريخ، ثم برقم القيد
  //     .exec();

  //   if (!journalEntries || journalEntries.length === 0) {
  //     throw new NotFoundException(
  //       'No journal entries found for this account in the given period',
  //     );
  //   }

  //   let debitTotal = 0;
  //   let creditTotal = 0;
  //   let runningBalance = 0;

  //   const details: any[] = [];

  //   for (const entry of journalEntries) {
  //     for (const line of entry.entries) {
  //       const accId =
  //         line.account && (line.account as any)._id
  //           ? (line.account as any)._id.toString()
  //           : line.account.toString();

  //       const lineCostCenterId =
  //         line.costCenter && (line.costCenter as any)._id
  //           ? (line.costCenter as any)._id.toString()
  //           : line.costCenter?.toString();

  //       if (accId === accountId.toString()) {
  //         if (!costCenter || lineCostCenterId === costCenter.toString()) {
  //           if (line.debit > 0) {
  //             debitTotal += line.debit;
  //             runningBalance += line.debit;

  //             details.push({
  //               date: entry.date,
  //               entryNumber: entry.sequenceNumber, // 👈 رقم القيد المتسلسل
  //               code: entry.code, // 👈 الكود الفريد (سنة-شهر-رقم)
  //               description: entry.description,
  //               type: 'debit',
  //               debit: line.debit,
  //               credit: 0,
  //               costCenter: line.costCenter || null,
  //               balance: runningBalance,
  //             });
  //           }

  //           if (line.credit > 0) {
  //             creditTotal += line.credit;
  //             runningBalance -= line.credit;

  //             details.push({
  //               date: entry.date,
  //               entryNumber: entry.sequenceNumber,
  //               code: entry.code,
  //               description: entry.description,
  //               type: 'credit',
  //               debit: 0,
  //               credit: line.credit,
  //               costCenter: line.costCenter || null,
  //               balance: runningBalance,
  //             });
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return {
  //     accountId,
  //     costCenter: costCenter || 'All',
  //     period: { startDate, endDate },
  //     totalDebit: debitTotal,
  //     totalCredit: creditTotal,
  //     balance: debitTotal - creditTotal,
  //     details,
  //   };
  // }


//   async getGeneralLedger(dto: GetLedgerDto) {
//   const { accountId, startDate, endDate, costCenter } = dto;

//   // نبنى الـ query بالـ queryBuilder
//   const qb = this.journalEntryRepository
//     .createQueryBuilder('journal')
//     .leftJoinAndSelect('journal.entries', 'entry')
//     .leftJoinAndSelect('entry.account', 'account')
//     .leftJoinAndSelect('entry.costCenter', 'cc')
//     .where('journal.date BETWEEN :startDate AND :endDate', { startDate, endDate })
//     .andWhere('account.id = :accountId', { accountId });

//   if (costCenter) {
//     qb.andWhere('cc.id = :costCenter', { costCenter });
//   }

//   const journalEntries = await qb
//     .orderBy('journal.date', 'ASC')
//     .addOrderBy('journal.sequenceNumber', 'ASC')
//     .getMany();

//   if (!journalEntries || journalEntries.length === 0) {
//     throw new NotFoundException(
//       'No journal entries found for this account in the given period',
//     );
//   }

//   let debitTotal = 0;
//   let creditTotal = 0;
//   let runningBalance = 0;

//   const details: any[] = [];

//   for (const entry of journalEntries) {
//     for (const line of entry.entries) {
//       const accId =
//         typeof line.account === 'object'
//           ? (line.account as any).id.toString()
//           :  String(line.account);

//       const lineCostCenterId =
//         typeof line.costCenter === 'object'
//           ? (line.costCenter as any).id.toString()
//           : String(line.costCenter);

//       if (accId === accountId.toString()) {
//         if (!costCenter || lineCostCenterId === costCenter.toString()) {
//           if (line.debit > 0) {
//             debitTotal += line.debit;
//             runningBalance += line.debit;

//             details.push({
//               date: entry.date,
//               entryNumber: entry.sequenceNumber,
//               code: entry.code,
//               description: entry.description,
//               type: 'debit',
//               debit: line.debit,
//               credit: 0,
//               costCenter: line.costCenter || null,
//               balance: runningBalance,
//             });
//           }

//           if (line.credit > 0) {
//             creditTotal += line.credit;
//             runningBalance -= line.credit;

//             details.push({
//               date: entry.date,
//               entryNumber: entry.sequenceNumber,
//               code: entry.code,
//               description: entry.description,
//               type: 'credit',
//               debit: 0,
//               credit: line.credit,
//               costCenter: line.costCenter || null,
//               balance: runningBalance,
//             });
//           }
//         }
//       }
//     }
//   }

//   return {
//     accountId,
//     costCenter: costCenter || 'All',
//     period: { startDate, endDate },
//     totalDebit: debitTotal,
//     totalCredit: creditTotal,
//     balance: debitTotal - creditTotal,
//     details,
//   };
// }


async getGeneralLedger(dto: GetLedgerDto) {
  const { accountId, startDate, endDate, costCenter } = dto;

  // ✅ نبنى الـ query بالـ queryBuilder
  const qb = this.journalEntryRepository
    .createQueryBuilder('journal')
    .leftJoinAndSelect('journal.entries', 'entry')
    .leftJoinAndSelect('entry.account', 'account')
    .leftJoinAndSelect('entry.costCenter', 'cc')
    .where('journal.date BETWEEN :startDate AND :endDate', { startDate, endDate })
    .andWhere('account.id = :accountId', { accountId });

  if (costCenter) {
    qb.andWhere('cc.id = :costCenter', { costCenter });
  }

  const journalEntries = await qb
    .orderBy('journal.date', 'ASC')
    .addOrderBy('journal.sequenceNumber', 'ASC')
    .getMany();

  if (!journalEntries || journalEntries.length === 0) {
    throw new NotFoundException(
      'No journal entries found for this account in the given period',
    );
  }

  let debitTotal = 0;
  let creditTotal = 0;
  let runningBalance = 0;

  const details: any[] = [];

  for (const entry of journalEntries) {
    for (const line of entry.entries) {
      const accId =
        typeof line.account === 'object'
          ? (line.account as any).id.toString()
          : String(line.account);

      const lineCostCenterId = line.costCenter
        ? typeof line.costCenter === 'object'
          ? (line.costCenter as any).id.toString()
          : String(line.costCenter)
        : null;

      if (accId === accountId.toString()) {
        if (!costCenter || lineCostCenterId === costCenter.toString()) {
          if (line.debit > 0) {
            debitTotal += Number(line.debit);
            runningBalance += Number(line.debit);

            details.push({
              date: entry.date,
              entryNumber: entry.sequenceNumber,
              code: entry.code,
              description: entry.description,
              type: 'debit',
              debit: Number(line.debit),
              credit: 0,
              costCenter: line.costCenter || null,
              balance: runningBalance,
            });
          }

          if (line.credit > 0) {
            creditTotal += Number(line.credit);
            runningBalance -= Number(line.credit);

            details.push({
              date: entry.date,
              entryNumber: entry.sequenceNumber,
              code: entry.code,
              description: entry.description,
              type: 'credit',
              debit: 0,
              credit: Number(line.credit),
              costCenter: line.costCenter || null,
              balance: runningBalance,
            });
          }
        }
      }
    }
  }

  return {
    accountId,
    costCenter: costCenter || 'All',
    period: { startDate, endDate },
    totalDebit: debitTotal,
    totalCredit: creditTotal,
    balance: debitTotal - creditTotal,
    details,
  };
}


}
