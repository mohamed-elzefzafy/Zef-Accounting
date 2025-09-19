import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
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
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.costCenterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() dto: UpdateCostCenterDto) {
    return this.costCenterService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.costCenterService.remove(id);
  }
}
