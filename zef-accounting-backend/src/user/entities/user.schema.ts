import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { defaultProfileImage } from 'src/shared/constants';
import { UserRoles } from 'src/shared/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isAccountVerified: boolean;

  @Prop({ type: String, default: null })
  verificationCode: string | null;

  @Prop({
    type: { url: String, public_id: String },
    _id: false,
    required: false,
    default: {
      url: defaultProfileImage,
      public_id: null,
    },
  })
  profileImage: { url: string; public_id: string };

  @Prop({ type: String, UserRoles, default: UserRoles.USER })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
