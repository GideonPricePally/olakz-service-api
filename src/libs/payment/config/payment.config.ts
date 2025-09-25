import { registerAs } from '@nestjs/config';

import validateConfig from '@/utils/validate-config';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentConfig } from './payment-config.type';

class EnvironmentVariablesValidator {
  // PAYSTACK PROPS
  @IsString()
  @IsNotEmpty()
  PAYSTACK_BASE_URL: string;
  @IsString()
  @IsNotEmpty()
  PAYSTACK_API_KEY: string;
}

export default registerAs<PaymentConfig>('payment', () => {
  console.info(`Register MailConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    paystack: {
      base_url: process.env.PAYSTACK_BASE_URL,
      api_key: process.env.PAYSTACK_API_KEY,
    },
  };
});
