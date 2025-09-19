import { Module } from '@nestjs/common';
import {  CostCenterEntity } from './entities/cost-center.entity';
import { CostCenterService } from './cost-center.service';
import { CostCenterController } from './cost-center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
  TypeOrmModule.forFeature([CostCenterEntity]),
  ],
  controllers: [CostCenterController],
  providers: [CostCenterService],
  exports: [CostCenterService],
})
export class CostCenterModule {}
