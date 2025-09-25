import { default_currencies, SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataManagerService } from '../utils/data-manager.service';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    @InjectRepository(Currency) private readonly currencyRepository: Repository<Currency>,
    private databaseManager: DataManagerService,
  ) {}

  async getDefaultCurrency() {
    return this.currencyRepository.findOne({ where: { is_default: true, active: true } });
  }

  async getCurrencyByCode(code: string) {
    return this.currencyRepository.findOne({ where: { code, active: true } });
  }

  async onModuleInit() {
    const currencyCount = await this.currencyRepository.count();
    if (currencyCount) return;

    const currencyInstances = await Promise.all(
      default_currencies.map(async ({ code, name, symbol, symbol_native, includes_tax, is_default }) => {
        return await this.currencyRepository.create({
          code,
          name,
          symbol_native,
          symbol,
          is_default,
          includes_tax,
          created_by: SYSTEM_USER_ID,
          updated_by: SYSTEM_USER_ID,
        });
      }),
    );
    await this.currencyRepository.save(currencyInstances);
  }
}
