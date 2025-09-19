// import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

// export class CreateCostCenterDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsIn(['project', 'product', 'branch'])
//   type: string;

//   @IsOptional()
//   @IsString()
//   description?: string;
// }


import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { CostCenterType } from '../entities/cost-center.entity';

export class CreateCostCenterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CostCenterType)
  type: CostCenterType;

  @IsOptional()
  @IsString()
  description?: string;
}
