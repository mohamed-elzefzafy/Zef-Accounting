import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument, AccountType } from './entities/chart.schema';
import { CreateAccountDto } from './dto/create-chart.dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}


  async createAccount(createAccountDto: CreateAccountDto) {
    const { name, type, parentId } = createAccountDto;


    if (!parentId) {
      throw new BadRequestException('This account must have a parent.');
    }

    if (AccountType[type] === undefined) {
      throw new BadRequestException('Invalid account type.');
    }

    let accountCode = '';
    let parent: AccountDocument | null = null;

    if (parentId) {
      parent = await this.accountModel.findById(parentId);
      if (!parent) throw new BadRequestException('Parent account not found.');

      const children = await this.accountModel.find({ parent: parent._id });

      if (children.length === 0) {
        accountCode = parent.accountCode ? `${parent.accountCode}.1` : '1';
      } else {
        // const lastChild = children[children.length - 1];
        // const lastCodePart = lastChild.accountCode.split('.').pop();
        // const newCodeNumber = parseInt(lastCodePart) + 1;
        // accountCode = parent.accountCode
        //   ? `${parent.accountCode}.${newCodeNumber}`
        //   : `${newCodeNumber}`;

        const lastChild = children[children.length - 1];
        const lastCodePart = lastChild.accountCode.split('.').pop() ?? '0';
        const newCodeNumber = parseInt(lastCodePart, 10) + 1;

        accountCode = parent.accountCode
          ? `${parent.accountCode}.${newCodeNumber}`
          : `${newCodeNumber}`;
      }

      parent.isMain = true;
      parent.isSub = false;
      await parent.save();
    } else {
      accountCode = this.generateTopAccountCode(type);
    }

    const newAccount = new this.accountModel({
      name,
      type,
      parent: parent?._id || null,
      accountCode,
      isMain: false,
      isSub: true,
    });

    return newAccount.save();
  }

  async getAll() {
    return this.accountModel.find().populate('parent').exec();
  }

  async getById(id: string) {
    return this.accountModel.findById(id).populate('parent').exec();
  }

  async getChildren(parentId: string) {
    return this.accountModel.find({ parent: parentId }).exec();
  }

  private generateTopAccountCode(type: string): string {
    switch (type) {
      case 'Asset':
        return '100';
      case 'Liability':
        return '200';
      case 'Equity':
        return '300';
      case 'Revenue':
        return '400';
      case 'Expense':
        return '500';
      default:
        throw new BadRequestException('Invalid top account type.');
    }
  }
}
