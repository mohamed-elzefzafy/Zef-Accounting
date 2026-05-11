import { Injectable, BadRequestException } from '@nestjs/common';
import {  AccountEntity, AccountType } from './entities/chart.entity';
import { CreateAccountDto } from './dto/create-chart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ChartOfAccountsService {
  constructor(
      @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
  const { name, type, parentId } = createAccountDto;

  // لو مفيش parentId، يبقى ده main account
  if (!parentId) {
    throw new BadRequestException('This account must have a parent.');
  }


  // تحقق من صحة الـ type
  if (!(Object.values(AccountType) as string[]).includes(type)) {
    throw new BadRequestException('Invalid account type.');
  }

  let accountCode = '';
  let parent: AccountEntity | null = null;

  if (parentId) {
    parent = await this.accountRepository.findOne({
      where: { id: parentId },
      relations: ['children'],
    });

    if (!parent) {
      throw new BadRequestException('Parent account not found.');
    }
    if (parent.type !==  type) {
  throw new BadRequestException('the type must be the Parent account type.');
    }

    const children = await this.accountRepository.find({
      where: { parent: { id: parentId } },
      order: { accountCode: 'ASC' },
    });

    if (children.length === 0) {
      // accountCode = parent.accountCode ? `${parent.accountCode}.1` : '1';
      accountCode = `${parent.accountCode}.1`;
    } else {
      const lastChild = children[children.length - 1];
      const lastCodePart = lastChild.accountCode.split('.').pop() ?? '0';
      const newCodeNumber = parseInt(lastCodePart, 10) + 1;

      accountCode = parent.accountCode
        ? `${parent.accountCode}.${newCodeNumber}`
        : `${newCodeNumber}`;
    }

    parent.isMain = true;
    parent.isSub = false;
    await this.accountRepository.save(parent);
  } else {
throw new BadRequestException('This account must have a parent.');
  }

  const newAccount = this.accountRepository.create({
    name,
    type,
    parent,
    accountCode,
    isMain: false,
    isSub: true,
  });

  return this.accountRepository.save(newAccount);
}


  async getAll() {
  return this.accountRepository.find({
    relations: ['parent'], // 👈 نفس populate('parent')
    order: {
      accountCode: 'ASC', // optional عشان يجيب الحسابات مرتبة بالكود
    },
  });
}

  async getById(id: number) {
  return this.accountRepository.findOne({
    where: { id },
    relations: ['parent'], // 👈 زي populate
  });
}



  async getChildren(parentId: number) {
  return this.accountRepository.find({
    where: { parent: { id: parentId } }, // 👈 parent relation
    relations: ['parent'],
    order: { accountCode: 'ASC' }, // optional للترتيب
  });
}


  // private generateTopAccountCode(type: string): string {
  //   switch (type) {
  //     case 'Asset':
  //       return '100';
  //     case 'Liability':
  //       return '200';
  //     case 'Equity':
  //       return '300';
  //     case 'Revenue':
  //       return '400';
  //     case 'Expense':
  //       return '500';
  //     default:
  //       throw new BadRequestException('Invalid top account type.');
  //   }
  // }
}
