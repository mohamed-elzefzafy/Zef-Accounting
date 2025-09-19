import { Module } from '@nestjs/common';
import { SettingsEntity } from './entities/settings.schema';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
