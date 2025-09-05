import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateCostCenterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['project', 'product', 'branch'])
  type: string;

  @IsOptional()
  @IsString()
  description?: string;
}
