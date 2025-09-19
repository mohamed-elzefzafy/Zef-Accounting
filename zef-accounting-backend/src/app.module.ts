import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { CostCenterModule } from './cost-center/cost-center.module';
import { SettingsModule } from './settings/settings.module';
import { AppService } from './app.service';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { ChartOfAccountsModule } from './chart/chart-of-accounts.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AccountEntity } from './chart/entities/chart.entity';
import { UsersModule } from './users/users.module';
import {
  JournalEntryEntity,
  JournalEntryLineEntity,
} from './journal-entries/entities/journal-entry.entity';
import { CostCenterEntity } from './cost-center/entities/cost-center.entity';
import { FiscalYearModule } from './fiscal-year/fiscal-year.module';
import { FiscalYearEntity } from './fiscal-year/entities/fiscal-year.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: config.get<string>('EMAIL_USERNAME'),
              pass: config.get<string>('EMAIL_PASSWORD'),
            },
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Neon database URL
        entities: [
          UserEntity,
          AccountEntity,
          JournalEntryEntity,
          JournalEntryLineEntity,
          CostCenterEntity,
          FiscalYearEntity
        ], // Add your entities here
        synchronize: true, // Disable in production to avoid unintended schema changes
        retryAttempts: 3,
        retryDelay: 3000,
        extra: {
          max: 10, // Maximum number of connections
          idleTimeoutMillis: 30000,
        },
      }),
    }),
    UsersModule,
    AuthModule,
    CostCenterModule,
    SettingsModule,
    ChartOfAccountsModule,
    GeneralLedgerModule,
    JournalEntriesModule,
    FiscalYearModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// mongodb+srv://mohamedelzefzafy:rW7NQcgJRxcyqNuU@cluster0.podjkqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
