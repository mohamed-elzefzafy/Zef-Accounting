import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class VerificationAccountDto {
  @IsString()
  @IsNotEmpty()
  verificationCode : string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
