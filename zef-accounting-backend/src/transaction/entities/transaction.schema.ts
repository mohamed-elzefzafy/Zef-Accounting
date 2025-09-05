import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ChartOfAccount', required: false })
  account?: Types.ObjectId;

  @Prop({ required: false })
  amount?: number;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'CostCenter', required: false })
  costCenter?: Types.ObjectId;

  // entries array for journal-style multi-line transactions (optional)
  @Prop({ type: [{ account: { type: Types.ObjectId, ref: 'ChartOfAccount' }, type: String, amount: Number }], required: false })
  entries?: { account: Types.ObjectId; type: 'debit' | 'credit'; amount: number }[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
