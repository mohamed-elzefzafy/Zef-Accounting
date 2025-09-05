import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CostCenterService } from './cost-center.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';

@Controller('api/v1/cost-centers')
export class CostCenterController {
  constructor(private readonly costCenterService: CostCenterService) {}

  @Post()
  create(@Body() dto: CreateCostCenterDto) {
    return this.costCenterService.create(dto);
  }

  @Get()
  findAll() {
    return this.costCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.costCenterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCostCenterDto) {
    return this.costCenterService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.costCenterService.remove(id);
  }
}
