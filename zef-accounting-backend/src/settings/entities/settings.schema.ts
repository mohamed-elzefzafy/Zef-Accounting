import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: 'My Company' })
  companyName: string;

  @Prop({ default: 'USD' })
  currency: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
