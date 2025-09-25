import { Uuid } from '@/common/types/common.type';
import { countryCodes, SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CurrencyService } from '../currency/currency.service';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService implements OnModuleInit {
  constructor(
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
    private readonly currencyService: CurrencyService,
  ) {}

  async onModuleInit() {
    const countryCount = await this.countryRepository.count();
    if (countryCount) return;
    const defaultCurrency = await this.currencyService.getDefaultCurrency();
    const create_instances = await Promise.all(
      Object.entries(countryCodes)?.map(async ([code, { emoji, image, name, unicode }]): Promise<Country> => {
        return this.countryRepository.create({
          name: name?.toLowerCase(),
          short_name: code.toLowerCase()?.toLowerCase(),
          unix_flag_code: unicode,
          thumbnail_url: image,
          emoji_flag: emoji,
          default_currency: defaultCurrency,
          active: code?.toLowerCase() === 'ng' ? true : false,
          created_by: SYSTEM_USER_ID,
          updated_by: SYSTEM_USER_ID,
        });
      }),
    );

    await this.countryRepository.save(create_instances);
  }

  findCountryById(country_id: string) {
    return this.countryRepository.findOne({ where: { id: country_id } });
  }

  findCountryByCode(country_code: string) {
    return this.countryRepository.findOne({ where: { short_name: country_code } });
  }

  findByIds(ids: Uuid[]) {
    return this.countryRepository.findBy({ id: In(ids) });
  }

  async getActiveCountries() {
    return this.countryRepository.find({ where: { active: true } });
  }

  async findOneAsBase() {
    return this.countryRepository.findOne({ where: { short_name: 'ng' } });
  }
}
