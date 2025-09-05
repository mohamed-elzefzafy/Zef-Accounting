import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JournalEntry, JournalEntryDocument } from './entities/journal-entry.schema';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JwtPayloadType } from 'src/shared/types';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectModel(JournalEntry.name)
    private readonly journalEntryModel: Model<JournalEntryDocument>,
  ) {}

  // 📌 Create
  async create(dto: CreateJournalEntryDto, user: JwtPayloadType) {
    const entry = new this.journalEntryModel({
      date: new Date(dto.date),
      description: dto.description,
      entries: dto.entries.map((line) => ({
        account: new Types.ObjectId(line.account),
        debit: line.debit || 0,
        credit: line.credit || 0,
        costCenter: line.costCenter
          ? new Types.ObjectId(line.costCenter)
          : null,
      })),
      createdBy: new Types.ObjectId(user.id),
      lastModifiedBy: new Types.ObjectId(user.id),
    });

    return entry.save();
  }

  // 📌 Find all
  async findAll() {
    return this.journalEntryModel
      .find()
      .populate('entries.account')
      .populate('entries.costCenter')
      .populate('createdBy')
      .populate('lastModifiedBy')
      .exec();
  }

  // 📌 Find one
  async findOne(id: string) {
    const entry = await this.journalEntryModel
      .findById(id)
      .populate('entries.account')
      .populate('entries.costCenter')
      .populate('createdBy')
      .populate('lastModifiedBy')
      .exec();

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  // 📌 Update
  async update(id: string, dto: UpdateJournalEntryDto, user: JwtPayloadType) {
    const entry = (await this.journalEntryModel
      .findById(id)
      .exec()) as JournalEntryDocument;

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    if (dto.date) entry.date = new Date(dto.date);
    if (dto.description) entry.description = dto.description;
    if (dto.entries) {
      entry.entries = dto.entries.map((line) => ({
        account: new Types.ObjectId(line.account),
        debit: line.debit || 0,
        credit: line.credit || 0,
        costCenter: line.costCenter
          ? new Types.ObjectId(line.costCenter)
          : null,
      }));
    }

    entry.lastModifiedBy = new Types.ObjectId(user.id);

    return entry.save();
  }

  // 📌 Delete
  async remove(id: string) {
    const result = await this.journalEntryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Journal entry not found');
    }
    return { message: 'Journal entry deleted successfully' };
  }
}
