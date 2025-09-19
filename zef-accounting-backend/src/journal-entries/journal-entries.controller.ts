import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UsePipes,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalBalancePipe } from 'src/shared/pipes/journal-balance.pipe';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JwtPayloadType } from 'src/shared/types';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { UserRoles } from 'src/shared/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OpenCloseYearJournalEntryLineDto } from './dto/open-close-year-journal-entries.dto';

@Controller('api/v1/journal-entries')
export class JournalEntriesController {
  constructor(private readonly journalEntriesService: JournalEntriesService) {}

  // 📌 Create
  @Post()
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  create(
    @Body(JournalBalancePipe) createJournalEntryDto: CreateJournalEntryDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.journalEntriesService.create(createJournalEntryDto, user);
  }

  @Post('reorder-all')
  @Roles([UserRoles.ADMIN])
  @UseGuards(AuthGuard)
  async reorderAll() {
    return this.journalEntriesService.reorderAll();
  }




  // 📌 Get all
  @Get()
  findAll() {
    return this.journalEntriesService.findAll();
  }

  // 📌 Get one
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.journalEntriesService.findOne(id);
  }

  // 📌 Update
  @Patch(':id')
  @UsePipes(JournalBalancePipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(JournalBalancePipe) updateJournalEntryDto: UpdateJournalEntryDto,
    @CurrentUser() user: JwtPayloadType,
  ) {
    return this.journalEntriesService.update(id, updateJournalEntryDto, user);
  }

  // 📌 Delete
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.journalEntriesService.remove(id);
  }
}
