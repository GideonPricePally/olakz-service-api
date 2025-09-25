import { Module } from '@nestjs/common';
import { AwsModule } from './aws/aws.module';
import { GcpModule } from './gcp/gcp.module';
import { PaymentProviderModule } from './payment/payment-provider.module';

@Module({
  imports: [AwsModule, GcpModule, PaymentProviderModule],
})
export class LibsModule {}
