import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JournalEntryDocument = HydratedDocument<JournalEntry>;

@Schema({ timestamps: true })
export class JournalEntry {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [
      {
        account: { type: Types.ObjectId, ref: 'ChartOfAccount', required: true },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        costCenter: { type: Types.ObjectId, ref: 'CostCenter', default: null },
      },
    ],
    required: true,
  })
  entries: {
    account: Types.ObjectId;
    debit: number;
    credit: number;
    costCenter?: Types.ObjectId | null;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lastModifiedBy?: Types.ObjectId;
}

export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);
