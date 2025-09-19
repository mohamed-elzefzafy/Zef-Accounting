import { Injectable } from '@nestjs/common';

import { UpdateSettingsDto } from './dto/update-settings.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/settings.schema';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private readonly settingsRepository: Repository<SettingsEntity>,
  ) {}

  // async getSettings(): Promise<SettingsEntity> {
  //   let settings = await this.settingsModel.findOne();
  //   if (!settings) settings = await this.settingsModel.create({});
  //   return settings;
  // }

  // async update(dto: UpdateSettingsDto): Promise<Settings> {
  //   return this.settingsModel.findOneAndUpdate({}, dto, { new: true, upsert: true });
  // }

  async getSettings(): Promise<SettingsEntity> {
    let settings = await this.settingsRepository.findOne({ where: {} });

    if (!settings) {
      settings = this.settingsRepository.create({});
      await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsEntity> {
    let settings = await this.settingsRepository.findOne({ where: {} });

    if (!settings) {
      settings = this.settingsRepository.create(dto);
    } else {
      this.settingsRepository.merge(settings, dto);
    }

    return this.settingsRepository.save(settings);
  }
}
