import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-chart.dto';
import { ChartOfAccountsService } from './chart-of-accounts.service';

@Controller('/api/v1/chart-of-accounts')
export class ChartOfAccountsController {
  constructor(private readonly chartService: ChartOfAccountsService) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.chartService.createAccount(createAccountDto);
  }

  @Get()
  async getAllAccounts() {
    return this.chartService.getAll();
  }

  @Get(':id')
  async getAccountById(@Param('id',ParseIntPipe) id: number) {
    return this.chartService.getById(id);
  }

  @Get('children/:parentId')
  async getChildren(@Param('parentId',ParseIntPipe) parentId: number) {
    return this.chartService.getChildren(parentId);
  }
}
