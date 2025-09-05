import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';
import { JwtModule } from '@nestjs/jwt';
import { JournalEntry, JournalEntrySchema } from './entities/journal-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JournalEntry.name, schema: JournalEntrySchema },
    ]),
    JwtModule,
  ],
  providers: [JournalEntriesService],
  controllers: [JournalEntriesController],
})
export class JournalEntriesModule {}
