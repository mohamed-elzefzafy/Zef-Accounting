import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  profileImage: string;
}
