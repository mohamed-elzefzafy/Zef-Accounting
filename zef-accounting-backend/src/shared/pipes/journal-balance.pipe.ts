// pipes/journal-balance.pipe.ts
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class JournalBalancePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.entries || !Array.isArray(value.entries)) {
      return value;
    }

    const totalDebit = value.entries.reduce(
      (sum, e) => sum + (e.debit || 0),
      0,
    );
    const totalCredit = value.entries.reduce(
      (sum, e) => sum + (e.credit || 0),
      0,
    );

    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        `Invalid journal entry: total debit (${totalDebit}) must equal total credit (${totalCredit}).`,
      );
    }

    return value;
  }
}
