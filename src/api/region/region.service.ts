import { CountryService } from '@/api/country/country.service';
import { CurrencyService } from '@/api/currency/currency.service';
import { FulfillmentService } from '@/api/fulfillment/fulfillment.service';
import { UserPayload, Uuid } from '@/common/types/common.type';
import { default_currencies, SYSTEM_USER_ID } from '@/constants/app.constant';
import { PaymentProviderService } from '@/libs/payment/payment-provider.service';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelationByString, FindOptionsRelations, In, Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionService implements OnModuleInit {
  constructor(
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
    private readonly countryService: CountryService,
    private readonly currencyService: CurrencyService,
    private readonly paymentProviderService: PaymentProviderService,
    private readonly fulfillmentService: FulfillmentService,
  ) {}
  async create(user: UserPayload, createRegionDto: CreateRegionDto): Promise<Region> {
    const {
      name,
      currency_code,
      gift_cards_taxable,
      automatic_taxes,
      countries: countryIds,
      payment_providers: paymentProviderIds,
      fulfillment_providers: fulfillmentProviderIds,
      metadata,
      includes_tax,
    } = createRegionDto;

    const currency = await this.currencyService.getCurrencyByCode(currency_code);
    const countries = await this.countryService.findByIds(countryIds);
    const payment_providers = await this.paymentProviderService.findByIds(paymentProviderIds);
    const fulfillment_providers = await this.fulfillmentService.findByIds(fulfillmentProviderIds);

    const newRegion = await this.regionRepository.create({
      name,
      currency_code,
      gift_cards_taxable,
      automatic_taxes,
      countries,
      payment_providers,
      fulfillment_providers,
      metadata,
      includes_tax,
      currency,
      created_by: user.sub,
      updated_by: user.sub,
    });

    return this.regionRepository.save(newRegion) as Promise<Region>;
  }

  findAll(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  findOneById(id: Uuid): Promise<Region> {
    return this.regionRepository.findOne({ where: { id } });
  }

  findOneByCountryId(countryId: Uuid, relationsOptions: FindOptionsRelations<Region> | FindOptionsRelationByString = []): Promise<Region> {
    return this.regionRepository.findOne({ where: { countries: { id: countryId } }, relations: relationsOptions });
  }

  findOneByCountryShortName(shortName: string, relationsOptions: FindOptionsRelations<Region> | FindOptionsRelationByString = []): Promise<Region> {
    return this.regionRepository.findOne({ where: { countries: { short_name: shortName } }, relations: relationsOptions });
  }

  findByIds(ids: Uuid[]) {
    return this.regionRepository.find({ where: { id: In(ids) } });
  }

  // findOneAsDefault(relationsOptions?: FindOptionsRelations<Region> | FindOptionsRelationByString): Promise<Region> {
  //   return this.regionRepository.findOne({ where: { is_default: true }, relations: relationsOptions });
  // }

  async update(user: UserPayload, id: Uuid, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const region = await this.findOneById(id);
    const {
      name,
      currency_code,
      gift_cards_taxable,
      automatic_taxes,
      countries: countryIds,
      payment_providers: paymentProviderIds,
      fulfillment_providers: fulfillmentProviderIds,
      metadata,
      includes_tax,
    } = updateRegionDto;

    if (name) region.name = name;
    if (gift_cards_taxable) region.gift_cards_taxable = gift_cards_taxable;
    if (automatic_taxes) region.automatic_taxes = automatic_taxes;
    if (metadata) region.metadata = metadata;
    if (includes_tax) region.includes_tax = includes_tax;

    if (currency_code) {
      const currency = await this.currencyService.getCurrencyByCode(currency_code);
      if (currency) {
        region.currency = currency;
        region.currency_code = currency_code;
      }
    }

    if (countryIds) {
      const countries = await this.countryService.findByIds(countryIds);
      if (countries?.length) region.countries = countries;
    }

    if (paymentProviderIds) {
      const payment_providers = await this.paymentProviderService.findByIds(paymentProviderIds);
      if (paymentProviderIds?.length) region.payment_providers = payment_providers;
    }

    if (fulfillmentProviderIds) {
      const fulfillment_providers = await this.fulfillmentService.findByIds(fulfillmentProviderIds);
      if (fulfillment_providers?.length) region.fulfillment_providers = fulfillment_providers;
    }

    region.updated_by = user.sub;
    return this.regionRepository.save(region) as Promise<Region>;
  }

  async remove(id: Uuid): Promise<void> {
    await this.regionRepository.delete(id);
  }

  async onModuleInit() {
    const baseRegionName = 'africa';
    const { code } = default_currencies[0];
    const regionExist = await this.regionRepository.findOne({ where: { name: baseRegionName } });
    if (!regionExist) {
      const baseCountry = await this.countryService.findOneAsBase();
      if (!baseCountry) throw new NotFoundException('base country not found ');

      const baseProviders = await this.paymentProviderService.findBaseProviders();
      const currency = await this.currencyService.getCurrencyByCode(code);
      if (!currency) throw new NotFoundException('default region currency not found');

      const baseRegion = this.regionRepository.create({
        name: baseRegionName,
        currency_code: code,
        gift_cards_taxable: false,
        automatic_taxes: true,
        countries: [baseCountry],
        payment_providers: baseProviders,
        fulfillment_providers: [],
        metadata: {},
        is_default: true,
        currency,
        includes_tax: true,
        created_by: SYSTEM_USER_ID,
        updated_by: SYSTEM_USER_ID,
      });
      await this.regionRepository.save(baseRegion);
    }
  }
}
