import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CostCenter, CostCenterSchema } from './entities/cost-center.schema';
import { CostCenterService } from './cost-center.service';
import { CostCenterController } from './cost-center.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: CostCenter.name, schema: CostCenterSchema }])],
  controllers: [CostCenterController],
  providers: [CostCenterService],
  exports: [CostCenterService],
})
export class CostCenterModule {}
