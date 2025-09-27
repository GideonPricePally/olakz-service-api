import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BankDetailModule } from './bank_detail/bank_detail.module';
import { CartModule } from './cart/cart.module';
import { CountryModule } from './country/country.module';
import { CurrencyModule } from './currency/currency.module';
import { FprModule } from './forget_password_request/fpr.module';
import { FormCollectionModule } from './form-collection/contact-message.module';
import { FulfillmentModule } from './fulfillment/fulfillment.module';
import { HealthModule } from './health/health.module';
import { HomeModule } from './home/home.module';
import { IdempotencyKeyModule } from './idempotency-key/idempotency-key.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { PermittedRoleKeysModule } from './permitted_role_key/permitted_role_key.module';
import { ProspectModule } from './prospect/prospect.module';
import { RegionModule } from './region/region.module';
import { RoleModule } from './role/role.module';
import { TagModule } from './tag/tag.module';
import { TaxRateModule } from './tax-rate/tax-rate.module';
import { TransactionModule } from './transaction/transaction.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils/utils.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    UserModule,
    HealthModule,
    AuthModule,
    HomeModule,
    PaymentModule,
    TaxRateModule,
    FulfillmentModule,
    CartModule,
    OrderModule,
    AdminModule,
    UtilsModule,
    BankDetailModule,
    WalletModule,
    CountryModule,
    CurrencyModule,
    FprModule,
    PermittedRoleKeysModule,
    ProspectModule,
    RegionModule,
    RoleModule,
    TagModule,
    TransactionModule,
    UploadModule,
    IdempotencyKeyModule,
    FormCollectionModule,
  ],
})
export class ApiModule {}
