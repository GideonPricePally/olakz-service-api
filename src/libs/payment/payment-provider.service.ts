import { CountryService } from '@/api/country/country.service';
import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdatePaymentProviderDto } from './dto/update-payment-provider.dto';
import { PaymentProvider } from './entities/payment-provider.entity';
import { IBankList } from './types/bank-list.provider';
import { IBaseProvider } from './types/base.provider';
import { IInitializePayment } from './types/initialize-payment';
import { IResolveAccount } from './types/resolve-account.provider';

const isBaseProvider = true;
@Injectable()
export class PaymentProviderService implements OnModuleInit {
  constructor(
    @Inject('PAYMENT_PROVIDERS') private readonly providers: (IBaseProvider & IBankList & IResolveAccount & IInitializePayment)[],
    @InjectRepository(PaymentProvider) private readonly paymentProviderRepository: Repository<PaymentProvider>,
    private readonly countryService: CountryService,
  ) {}

  findByIds(ids: Uuid[]) {
    return this.paymentProviderRepository.findBy({ id: In(ids) });
  }

  findOne(id: Uuid) {
    return this.paymentProviderRepository.findOneBy({ id });
  }

  async update(id: Uuid, updatePaymentDto: UpdatePaymentProviderDto): Promise<PaymentProvider> {
    const paymentProvider = await this.findOne(id);
    const { name, is_installed } = updatePaymentDto;

    if (name) paymentProvider.name = name;
    if (is_installed) paymentProvider.is_installed = is_installed;

    return this.paymentProviderRepository.save(paymentProvider);
  }

  async verifyAccountNumber(countryId: string, bankCode: string, accountNumber: string) {
    const providerService = await this.providerServicebyCountryId(countryId, isBaseProvider);

    const customerQuery = new URLSearchParams();
    customerQuery.append('bank_code', bankCode);
    customerQuery.append('account_number', accountNumber);

    try {
      return (await providerService?.verifyAccountNumber(customerQuery?.toString())) || [];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyPayment(countryId: string, reference: string) {
    const providerService = await this.providerServicebyCountryId(countryId, isBaseProvider);

    try {
      return await providerService?.verifyPayment(reference);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async banks(countryId: string) {
    const providerService = await this.providerServicebyCountryId(countryId, isBaseProvider);
    const country = await this.countryService.findCountryById(countryId);

    const customerQuery = new URLSearchParams();
    customerQuery.append('country', country.name?.toLowerCase());

    return (await providerService?.banks(customerQuery?.toString())) || [];
  }

  async findBaseProviders() {
    return await this.paymentProviderRepository.find({
      where: { is_base: true, is_installed: true },
    });
  }

  async providerServicebyCountryId(countryId: string, isBase = false) {
    const provider = await this.paymentProviderRepository.findOne({
      where: { region: { countries: { id: countryId } }, is_base: isBase },
      relations: ['region'],
    });

    if (!provider) throw new HttpException('region not supported', HttpStatus.UNPROCESSABLE_ENTITY);
    const providerService = this.providers.find((p) => p.name === provider?.name);
    return providerService;
  }

  async providersbyCountryId(countryId: string) {
    const providers = await this.paymentProviderRepository.find({
      where: { region: { countries: { id: countryId } }, is_installed: true },
    });

    if (!providers.length) throw new HttpException('region not supported', HttpStatus.UNPROCESSABLE_ENTITY);
    return providers;
  }

  async baseProviderByCountryId(countryId: string) {
    const provider = await this.paymentProviderRepository.findOne({
      where: { region: { countries: { id: countryId } }, is_base: true },
      relations: ['region'],
    });

    if (!provider) throw new HttpException('region not supported', HttpStatus.UNPROCESSABLE_ENTITY);
    return provider;
  }

  async onModuleInit() {
    const dbSlugs: Array<PaymentProvider['slug']> = (await this.paymentProviderRepository.find({ select: ['slug', 'id'] })).map(
      (provider) => provider.slug,
    );
    const providers = await this.providers;
    if (providers.length === dbSlugs.length && providers.every((provider) => dbSlugs.includes(provider.name))) return;
    else if (providers.length < dbSlugs.length && providers.every((provider) => dbSlugs.includes(provider.name))) {
      return dbSlugs.forEach(async (slug) => {
        if (!providers.map((e) => e.name).includes(slug))
          await this.paymentProviderRepository.update({ slug }, { is_installed: false, is_base: false });
      });
    }
    if (providers.length === dbSlugs.length && !providers.every((provider) => dbSlugs.includes(provider.name))) {
      dbSlugs.forEach(async (slug) => {
        if (!providers.map((e) => e.name).includes(slug))
          await this.paymentProviderRepository.update({ slug }, { is_installed: false, is_base: false });
      });
    }

    const providerInstances = [];
    for (const provider of providers) {
      if (!dbSlugs.includes(provider.name))
        providerInstances.push(
          this.paymentProviderRepository.create({
            name: provider.name,
            slug: provider.name,
            is_base: provider.isBase,
            is_installed: true,
            created_by: SYSTEM_USER_ID,
            updated_by: SYSTEM_USER_ID,
          }),
        );
    }
    await this.paymentProviderRepository.save(providerInstances);
  }
}
