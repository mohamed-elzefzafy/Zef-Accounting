import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CostCenterDocument = HydratedDocument<CostCenter>;

@Schema({ timestamps: true })
export class CostCenter {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['project', 'product', 'branch'] })
  type: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  active: boolean;
}

export const CostCenterSchema = SchemaFactory.createForClass(CostCenter);
