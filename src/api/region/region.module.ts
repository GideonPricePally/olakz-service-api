import { PaymentProviderModule } from '@/libs/payment/payment-provider.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from '../country/country.module';
import { CurrencyModule } from '../currency/currency.module';
import { FulfillmentModule } from '../fulfillment/fulfillment.module';
import { Region } from './entities/region.entity';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  imports: [TypeOrmModule.forFeature([Region]), CountryModule, CurrencyModule, PaymentProviderModule, FulfillmentModule],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
