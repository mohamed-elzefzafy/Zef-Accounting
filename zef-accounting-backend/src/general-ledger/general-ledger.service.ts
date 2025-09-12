// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import {
//   JournalEntry,
//   JournalEntryDocument,
// } from '../journal-entries/entities/journal-entry.schema';
// import { GetLedgerDto } from './dto/get-ledger.dto';

// @Injectable()
// export class GeneralLedgerService {
//   constructor(
//     @InjectModel(JournalEntry.name)
//     private readonly journalEntryModel: Model<JournalEntryDocument>,
//   ) {}

//   async getGeneralLedger(dto: GetLedgerDto) {
//     const { accountId, startDate, endDate } = dto;
//     const accountObjectId = new Types.ObjectId(accountId);

//     const journalEntries = await this.journalEntryModel
//       .find({
//         date: {
//           $gte: new Date(startDate as string),
//           $lte: new Date(endDate as string),
//         },
//         'entries.account': accountObjectId,
//       })
//       .populate('entries.account')
//       .exec();

//     if (!journalEntries || journalEntries.length === 0) {
//       throw new NotFoundException(
//         'No journal entries found for this account in the given period',
//       );
//     }

//     let debit = 0;
//     let credit = 0;
//     const details: any[] = [];

//     for (const entry of journalEntries) {
//       for (const line of entry.entries) {
//         // handle both ObjectId and populated object
//         const accId =
//           line.account && (line.account as any)._id
//             ? (line.account as any)._id.toString()
//             : line.account.toString();

//         if (accId === accountId.toString()) {
//           if (line.debit > 0) {
//             debit += line.debit;
//             details.push({
//               date: entry.date,
//               description: entry.description,
//               type: 'debit',
//               amount: line.debit,
//             });
//           }

//           if (line.credit > 0) {
//             credit += line.credit;
//             details.push({
//               date: entry.date,
//               description: entry.description,
//               type: 'credit',
//               amount: line.credit,
//             });
//           }
//         }
//       }
//     }

//     return {
//       accountId,
//       period: { startDate, endDate },
//       totalDebit: debit,
//       totalCredit: credit,
//       balance: debit - credit,
//       details,
//     };
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  JournalEntry,
  JournalEntryDocument,
} from '../journal-entries/entities/journal-entry.schema';
import { GetLedgerDto } from './dto/get-ledger.dto';

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectModel(JournalEntry.name)
    private readonly journalEntryModel: Model<JournalEntryDocument>,
  ) {}

  async getGeneralLedger(dto: GetLedgerDto) {
    const { accountId, startDate, endDate, costCenter } = dto;

    const accountObjectId = new Types.ObjectId(accountId);

    // Base query
    const query: any = {
      date: {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      },
      'entries.account': accountObjectId,
    };

    // Add costCenter filter if provided
    if (costCenter) {
      query['entries.costCenter'] = new Types.ObjectId(costCenter);
    }

    const journalEntries = await this.journalEntryModel
      .find(query)
      .populate('entries.account')
      .populate('entries.costCenter')
      .exec();

    if (!journalEntries || journalEntries.length === 0) {
      throw new NotFoundException(
        'No journal entries found for this account in the given period',
      );
    }

    let debit = 0;
    let credit = 0;
    const details: any[] = [];

    for (const entry of journalEntries) {
      for (const line of entry.entries) {
        const accId =
          line.account && (line.account as any)._id
            ? (line.account as any)._id.toString()
            : line.account.toString();

        // Filter by costCenter if provided
        const lineCostCenterId =
          line.costCenter && (line.costCenter as any)._id
            ? (line.costCenter as any)._id.toString()
            : line.costCenter?.toString();

        if (accId === accountId.toString()) {
          if (!costCenter || lineCostCenterId === costCenter.toString()) {
            if (line.debit > 0) {
              debit += line.debit;
              details.push({
                date: entry.date,
                description: entry.description,
                type: 'debit',
                amount: line.debit,
                costCenter: line.costCenter || null,
              });
            }

            if (line.credit > 0) {
              credit += line.credit;
              details.push({
                date: entry.date,
                description: entry.description,
                type: 'credit',
                amount: line.credit,
                costCenter: line.costCenter || null,
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
      totalDebit: debit,
      totalCredit: credit,
      balance: debit - credit,
      details,
    };
  }
}
