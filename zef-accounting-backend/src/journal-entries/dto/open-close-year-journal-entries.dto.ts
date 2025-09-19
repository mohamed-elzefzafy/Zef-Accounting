import {IsNotEmpty,IsNumber} from 'class-validator';

export class OpenCloseYearJournalEntryLineDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;
}
