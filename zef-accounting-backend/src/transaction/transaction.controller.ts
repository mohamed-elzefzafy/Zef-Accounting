import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('api/v1/transactions')
export class TransactionController {
  constructor(private readonly txService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.txService.create(dto);
  }

  @Get()
  findAll(@Query('costCenter') costCenter?: string) {
    return this.txService.findAll(costCenter);
  }
}
