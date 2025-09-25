import { CountryModule } from '@/api/country/country.module';
import { UtilsModule } from '@/api/utils/utils.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentProvider } from './entities/payment-provider.entity';
import { PaymentProviderService } from './payment-provider.service';
import { FlutterwaveProviderService } from './providers/flutterwave/flutterwave-provider.service';
import { LencoProviderService } from './providers/lenco/lenco-provider.service';
import { MixpayProviderService } from './providers/mixpay/mixpay-provider.service';
import { OpayProviderService } from './providers/opay/opay-provider.service';
import { PaystackProviderService } from './providers/paystack/paystack-provider.service';
import { PolarProviderService } from './providers/polar/polar-provider.service';
import { ProvidusProviderService } from './providers/providus/providus-provider.service';
import { StanbicProviderService } from './providers/stanbic/stanbic-provider.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentProvider]), HttpModule, UtilsModule, CountryModule],
  providers: [
    PaystackProviderService,
    FlutterwaveProviderService,
    LencoProviderService,
    MixpayProviderService,
    OpayProviderService,
    PolarProviderService,
    ProvidusProviderService,
    StanbicProviderService,
    PaymentProviderService,
    {
      provide: 'PAYMENT_PROVIDERS',
      useFactory: (
        paystack: PaystackProviderService,
        flutterwave: FlutterwaveProviderService,
        lenco: LencoProviderService,
        mixpay: MixpayProviderService,
        opay: OpayProviderService,
        polar: PolarProviderService,
        providus: ProvidusProviderService,
        stanbic: StanbicProviderService,
      ) => [paystack, flutterwave, lenco, mixpay, opay, polar, providus, stanbic],
      inject: [
        PaystackProviderService,
        FlutterwaveProviderService,
        LencoProviderService,
        MixpayProviderService,
        OpayProviderService,
        PolarProviderService,
        ProvidusProviderService,
        StanbicProviderService,
      ],
    },
  ],
  exports: [PaymentProviderService, UtilsModule],
})
export class PaymentProviderModule {}
