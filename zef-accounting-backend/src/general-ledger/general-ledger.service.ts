import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JournalEntry, JournalEntryDocument } from '../journal-entries/entities/journal-entry.schema';
import { GetLedgerDto } from './dto/get-ledger.dto';
import { Account, AccountDocument } from 'src/chart/entities/chart.schema';

@Injectable()
export class GeneralLedgerService {
  constructor(
    @InjectModel(JournalEntry.name) private journalModel: Model<JournalEntryDocument>,
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}


  async getLedger(dto: GetLedgerDto) {
  const { accountId, startDate, endDate } = dto;

  const query: any = { 'entries.account': accountId };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const journalEntries = await this.journalModel
    .find(query)
    .populate('entries.account');

  let debit = 0;
  let credit = 0;
  const details: {
    date: Date;
    description: string;
    type: 'debit' | 'credit';
    amount: number;
  }[] = [];

  for (const entry of journalEntries) {
    for (const line of entry.entries) {
      if (line.account.toString() === accountId) {
        if (line.debit > 0) {
          debit += line.debit;
          details.push({
            date: entry.date,
            description: entry.description,
            type: 'debit',
            amount: line.debit,
          });
        }

        if (line.credit > 0) {
          credit += line.credit;
          details.push({
            date: entry.date,
            description: entry.description,
            type: 'credit',
            amount: line.credit,
          });
        }
      }
    }
  }

  return {
    accountId,
    debit,
    credit,
    balance: debit - credit,
    transactions: details,
  };
}

}
