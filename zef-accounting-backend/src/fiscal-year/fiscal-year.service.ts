// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import { CloseFiscalYearDto } from './dto/close-fiscal-year.dto';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { JournalEntriesService } from 'src/journal-entries/journal-entries.service';

// @Injectable()
// export class FiscalYearService {
//   constructor(
//     @InjectRepository(FiscalYearEntity)
//     private readonly fiscalYearRepo: Repository<FiscalYearEntity>,
//   ) {}

//   async create(dto: CreateFiscalYearDto): Promise<FiscalYearEntity> {
//     const exists = await this.fiscalYearRepo.findOne({ where: { year: dto.year } });
//     if (exists) {
//       throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
//     }

//     const fiscalYear = this.fiscalYearRepo.create(dto);
//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   async findAll(): Promise<FiscalYearEntity[]> {
//     return this.fiscalYearRepo.find({ order: { year: 'ASC' } });
//   }

//   async findOne(year: number): Promise<FiscalYearEntity> {
//     const fy = await this.fiscalYearRepo.findOne({ where: { year } });
//     if (!fy) throw new NotFoundException(`Fiscal year ${year} not found`);
//     return fy;
//   }

//   async close(dto: CloseFiscalYearDto, user: UserEntity): Promise<FiscalYearEntity> {
//     const fy = await this.findOne(dto.year);

//     if (fy.isClosed) {
//       throw new BadRequestException(`Fiscal year ${dto.year} is already closed`);
//     }

//     fy.isClosed = true;
//     fy.closedAt = new Date();
//     fy.closedBy = user;

//     return this.fiscalYearRepo.save(fy);
//   }
// }


// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
// import { FiscalYearEntity } from './entities/fiscal-year.entity';

// @Injectable()
// export class FiscalYearService {
//   constructor(
//     @InjectRepository(FiscalYearEntity)
//     private readonly fiscalYearRepo: Repository<FiscalYearEntity>,
//   ) {}

//   // إنشاء سنة مالية جديدة
//   async create(dto: CreateFiscalYearDto) {
//     const existing = await this.fiscalYearRepo.findOne({ where: { year: dto.year } });
//     if (existing) {
//       throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
//     }

//     const fiscalYear = this.fiscalYearRepo.create({
//       year: dto.year,
//       isClosed: false,
//     });

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // جلب كل السنوات المالية
//   async findAll() {
//     return this.fiscalYearRepo.find({ order: { year: 'ASC' } });
//   }

//   // جلب سنة مالية معينة
//   async findOne(year: number) {
//     const fiscalYear = await this.fiscalYearRepo.findOne({ where: { year } });
//     if (!fiscalYear) {
//       throw new NotFoundException(`Fiscal year ${year} not found`);
//     }
//     return fiscalYear;
//   }

//   // قفل السنة المالية
//   async closeYear(year: number, userId: string) {
//     const fiscalYear = await this.findOne(year);

//     if (fiscalYear.isClosed) {
//       throw new BadRequestException(`Fiscal year ${year} is already closed`);
//     }

//     fiscalYear.isClosed = true;
//     fiscalYear.closedAt = new Date();
//     fiscalYear.closedBy = userId;

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // فتح السنة المالية (إلغاء القفل)
//   async openYear(year: number) {
//     const fiscalYear = await this.findOne(year);

//     if (!fiscalYear.isClosed) {
//       throw new BadRequestException(`Fiscal year ${year} is already open`);
//     }

//     fiscalYear.isClosed = false;
//     fiscalYear.closedAt = null;
//     fiscalYear.closedBy = null;

//     return this.fiscalYearRepo.save(fiscalYear);
//   }

//   // جلب السنة الحالية (أحدث سنة غير مقفولة)
//   async getCurrentYear() {
//     const fiscalYear = await this.fiscalYearRepo.findOne({
//       where: { isClosed: false },
//       order: { year: 'DESC' },
//     });

//     if (!fiscalYear) {
//       throw new NotFoundException('No active fiscal year found');
//     }

//     return fiscalYear;
//   }
// }



import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  FiscalYearEntity } from './entities/fiscal-year.entity';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';

@Injectable()
export class FiscalYearService {
  constructor(
    @InjectRepository(FiscalYearEntity)
    private readonly fiscalYearRepo: Repository<FiscalYearEntity>,
  ) {}

  async create(dto: CreateFiscalYearDto) {
    const existing = await this.fiscalYearRepo.findOne({ where: { year: dto.year } });
    if (existing) {
      throw new BadRequestException(`Fiscal year ${dto.year} already exists`);
    }

    const fiscalYear = this.fiscalYearRepo.create({
      year: dto.year,
      isClosed: false,
    });

    return this.fiscalYearRepo.save(fiscalYear);
  }

  async findAll() {
    return this.fiscalYearRepo.find({ order: { year: 'ASC' } });
  }

  async findOne(year: number) {
    const fiscalYear = await this.fiscalYearRepo.findOne({ where: { year } });
    if (!fiscalYear) {
      throw new NotFoundException(`Fiscal year ${year} not found`);
    }
    return fiscalYear;
  }

  async closeYear(year: number, userId: string) {
    const fiscalYear = await this.findOne(year);

    if (fiscalYear.isClosed) {
      throw new BadRequestException(`Fiscal year ${year} is already closed`);
    }

    fiscalYear.isClosed = true;
    fiscalYear.closedAt = new Date();
    fiscalYear.closedBy = userId;

    return this.fiscalYearRepo.save(fiscalYear);
  }

  async openYear(year: number) {
    const fiscalYear = await this.findOne(year);

    if (!fiscalYear.isClosed) {
      throw new BadRequestException(`Fiscal year ${year} is already open`);
    }

    fiscalYear.isClosed = false;
    fiscalYear.closedAt = null;
    fiscalYear.closedBy = null;

    return this.fiscalYearRepo.save(fiscalYear);
  }

  async getCurrentYear() {
    const fiscalYear = await this.fiscalYearRepo.findOne({
      where: { isClosed: false },
      order: { year: 'DESC' },
    });

    if (!fiscalYear) {
      throw new NotFoundException('No active fiscal year found');
    }

    return fiscalYear;
  }
}
