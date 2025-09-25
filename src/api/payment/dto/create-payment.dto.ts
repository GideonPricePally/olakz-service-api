import { Currency } from '@/api/currency/entities/currency.entity';
import { EPaymentStatus } from '@/common/types/common.type';
import { PaymentProvider } from '@/libs/payment/entities/payment-provider.entity';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  currency_code: string;

  @IsObject()
  @IsNotEmpty()
  currency: Currency;

  @IsObject()
  @IsNotEmpty()
  provider: PaymentProvider;

  @IsString()
  @IsOptional()
  status?: EPaymentStatus;

  @IsString()
  @IsNotEmpty()
  idempotency_key: string;

  @IsString()
  @IsNotEmpty()
  created_by: string;

  @IsString()
  @IsOptional()
  captured_at?: string;

  @IsString()
  @IsNotEmpty()
  updated_by: string;
}
