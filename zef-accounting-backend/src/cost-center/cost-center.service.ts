import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CostCenterEntity } from './entities/cost-center.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CostCenterService {
  constructor(
      @InjectRepository(CostCenterEntity)
    private readonly costCenterRepository: Repository<CostCenterEntity>,
  ) {}

  // async create(dto: CreateCostCenterDto): Promise<CostCenter> {
  //   return this.costCenterModel.create(dto);
  // }

  async findAll(): Promise<CostCenterEntity[]> {
  return this.costCenterRepository.find();
}


  async create(dto: CreateCostCenterDto): Promise<CostCenterEntity> {
  const costCenter = this.costCenterRepository.create(dto);
  return await this.costCenterRepository.save(costCenter);
}


  // async findAll(): Promise<CostCenter[]> {
  //   return this.costCenterModel.find().lean().exec();
  // }
  // async findOne(id: number): Promise<CostCenter> {
  //   const cc = await this.costCenterModel.findById(id).exec();
  //   if (!cc) throw new NotFoundException('CostCenter not found');
  //   return cc;
  // }
  // async update(id: number, dto: UpdateCostCenterDto): Promise<CostCenter> {
  //   const updated = await this.costCenterModel
  //     .findByIdAndUpdate(id, dto, { new: true })
  //     .exec();
  //   if (!updated) throw new NotFoundException('CostCenter not found');
  //   return updated;
  // }
  // async remove(id: number): Promise<void> {
  //   await this.costCenterModel.findByIdAndDelete(id).exec();
  // }

  async findOne(id: number): Promise<CostCenterEntity> {
  const cc = await this.costCenterRepository.findOne({ where: { id } });
  if (!cc) throw new NotFoundException('CostCenter not found');
  return cc;
}

async update(id: number, dto: UpdateCostCenterDto): Promise<CostCenterEntity> {
  const cc = await this.costCenterRepository.findOne({ where: { id } });
  if (!cc) throw new NotFoundException('CostCenter not found');

  const updated = this.costCenterRepository.merge(cc, dto);
  return this.costCenterRepository.save(updated);
}

async remove(id: number): Promise<void> {
  const result = await this.costCenterRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException('CostCenter not found');
  }
}

}
