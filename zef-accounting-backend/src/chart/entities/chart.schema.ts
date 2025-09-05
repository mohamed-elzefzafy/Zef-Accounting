import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AccountType {
  Asset = 'Asset',
  Liability = 'Liability',
  Equity = 'Equity',
  Revenue = 'Revenue',
  Expense = 'Expense',
}


export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(AccountType) })
  type: AccountType;

  @Prop()
  accountCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Account', default: null })
  parent?: Types.ObjectId;

  @Prop({ default: false })
  isMain: boolean;

  @Prop({ default: true })
  isSub: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
