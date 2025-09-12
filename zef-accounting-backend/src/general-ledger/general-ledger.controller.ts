import { Body, Controller, Post } from '@nestjs/common';
import { GeneralLedgerService } from './general-ledger.service';
import { GetLedgerDto } from './dto/get-ledger.dto';

@Controller('api/v1/general-ledger')
export class GeneralLedgerController {
  constructor(private readonly ledgerService: GeneralLedgerService) {}

  @Post()
  async getLedger(@Body() dto: GetLedgerDto) {
    return this.ledgerService.getGeneralLedger(dto);
  }
}
