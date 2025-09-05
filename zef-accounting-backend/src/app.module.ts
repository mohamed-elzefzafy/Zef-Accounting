import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/users.module';
import { CostCenterModule } from './cost-center/cost-center.module';
import { SettingsModule } from './settings/settings.module';
import { TransactionModule } from './transaction/transaction.module';
import { AppService } from './app.service';
import { GeneralLedgerModule } from './general-ledger/general-ledger.module';
import { ChartOfAccountsModule } from './chart/chart-of-accounts.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';

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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
        dbName: 'Zef-Accounting',
      }),
    }),
    UserModule,
    AuthModule,
    CostCenterModule,
    SettingsModule,
    TransactionModule,
    ChartOfAccountsModule,
    GeneralLedgerModule,
    JournalEntriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




// mongodb+srv://mohamedelzefzafy:rW7NQcgJRxcyqNuU@cluster0.podjkqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0