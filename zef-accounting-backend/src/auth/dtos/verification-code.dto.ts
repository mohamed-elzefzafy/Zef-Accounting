import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class VerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  verificationCode : string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword : string;
}
