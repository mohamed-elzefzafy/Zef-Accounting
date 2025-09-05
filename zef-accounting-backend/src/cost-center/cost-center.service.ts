import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CostCenter, CostCenterDocument } from './entities/cost-center.schema';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Injectable()
export class CostCenterService {
  constructor(@InjectModel(CostCenter.name) private costCenterModel: Model<CostCenterDocument>) {}

  async create(dto: CreateCostCenterDto): Promise<CostCenter> {
    return this.costCenterModel.create(dto);
  }

  async findAll(): Promise<CostCenter[]> {
    return this.costCenterModel.find().lean().exec();
  }
  async findOne(id: string): Promise<CostCenter> {
    const cc = await this.costCenterModel.findById(id).exec();
    if (!cc) throw new NotFoundException('CostCenter not found');
    return cc;
  }
  async update(id: string, dto: UpdateCostCenterDto): Promise<CostCenter> {
    const updated = await this.costCenterModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('CostCenter not found');
    return updated;
  }
  async remove(id: string): Promise<void> {
    await this.costCenterModel.findByIdAndDelete(id).exec();
  }
}
