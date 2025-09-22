// import { Controller, Post, Body, Get, Param, Patch, Req } from '@nestjs/common';
// import { FiscalYearService } from './fiscal-year.service';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import { CloseFiscalYearDto } from './dto/close-fiscal-year.dto';

// @Controller('fiscal-years')
// export class FiscalYearController {
//   constructor(private readonly fiscalYearService: FiscalYearService) {}

//   @Post()
//   async create(@Body() dto: CreateFiscalYearDto) {
//     return this.fiscalYearService.create(dto);
//   }

//   @Get()
//   async findAll() {
//     return this.fiscalYearService.findAll();
//   }

//   @Get(':year')
//   async findOne(@Param('year') year: number) {
//     return this.fiscalYearService.findOne(Number(year));
//   }


// @Post(':year/close')
// async close(@Param('year') year: number, @Req() req) {
//   return this.fiscalYearService.closeYear(year, req.user.sub);
// }

// @Post(':year/open')
// async open(@Param('year') year: number, @Req() req) {
//   return this.fiscalYearService.openYear(year, req.user.sub);
// }

// }



import { Controller, Post, Get, Param, Body, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FiscalYearService } from './fiscal-year.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { JwtPayloadType } from 'src/common/types';
import { UserRoles } from 'src/common/enums/roles.enum';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1/fiscal-years')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @Post()
  async create(@Body() dto: CreateFiscalYearDto) {
    return this.fiscalYearService.create(dto);
  }

  @Get()
  async findAll() {
    return this.fiscalYearService.findAll();
  }

  @Get(':year')
  async findOne(@Param('year') year: number) {
    return this.fiscalYearService.findOne(Number(year));
  }

  // @Patch(':year/close')
  //   @Roles([UserRoles.ADMIN])
  //   @UseGuards(AuthGuard)
  // async closeYear(@Param('year') year: number,@CurrentUser() user: JwtPayloadType) {
  //   const userId = user.id.toString();
  //   return this.fiscalYearService.closeYear(Number(year), userId);
  // }

  // @Patch(':year/open')
  //   @Roles([UserRoles.ADMIN])
  //   @UseGuards(AuthGuard)
  // async openYear(@Param('year') year: number) {
  //   return this.fiscalYearService.openYear(Number(year));
  // }

  @Get('current/active')
  async getCurrentYear() {
    return this.fiscalYearService.getCurrentYear();
  }


    // 👇 إقفال السنة
  @Patch(':year/close')
    @Roles([UserRoles.ADMIN])
   @UseGuards(AuthGuard)
  async closeYear(@Param('year', ParseIntPipe) year: number,  @CurrentUser() user: JwtPayloadType) {
    const userId = user.id;
    return this.fiscalYearService.closeYear(year , userId);
  }

  // 👇 افتتاح السنة
  @Patch(':year/open')
    @Roles([UserRoles.ADMIN])
   @UseGuards(AuthGuard)
  async openYear(@Param('year', ParseIntPipe) year: number) {
    return this.fiscalYearService.openYear(year);
  }
}
