import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserAddressDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^01[0-2,5]{1}[0-9]{8}$/, {
    message: 'Phone number must be a valid Egyptian number (e.g., 01112345678)',
  })
  phoneNumber: string;
}
