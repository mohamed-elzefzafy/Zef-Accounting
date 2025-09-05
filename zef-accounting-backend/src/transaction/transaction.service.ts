import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './entities/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(@InjectModel(Transaction.name) private txModel: Model<TransactionDocument>) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    // if entries provided, validate balanced
    if (dto.entries && dto.entries.length > 0) {
      const debit = dto.entries.filter(e => e.type === 'debit').reduce((s, e) => s + e.amount, 0);
      const credit = dto.entries.filter(e => e.type === 'credit').reduce((s, e) => s + e.amount, 0);
      if (debit !== credit) throw new BadRequestException('Entries must be balanced (debit === credit)');
      return this.txModel.create(dto);
    }
    // otherwise simple single-line transaction (account + amount)
    if (!dto.account || dto.amount == null) throw new BadRequestException('account and amount required for simple transaction');
    return this.txModel.create(dto);
  }

  async findAll(costCenterId?: string): Promise<any[]> {
    const filter: any = {};
    if (costCenterId) filter.costCenter = new Types.ObjectId(costCenterId);
    return this.txModel.find(filter).populate('user').populate('account').populate('costCenter').lean();
  }
}
