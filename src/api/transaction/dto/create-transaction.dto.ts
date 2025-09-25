import { Currency } from '@/api/currency/entities/currency.entity';
import { Payment } from '@/api/payment/entities/payment.entity';
import { Wallet } from '@/api/wallet/entities/wallet.entity';
import { TransactionType } from '@/common/types/account.type';
import { EPaymentStatus } from '@/common/types/common.type';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  payment?: Payment;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsObject()
  @IsNotEmpty()
  currency: Currency;

  @IsString()
  @IsOptional()
  type: TransactionType;

  wallet: Wallet;
  @IsString()
  @IsOptional()
  currency_code: string;

  @IsString()
  @IsOptional()
  created_by: string;

  @IsString()
  @IsOptional()
  updated_by: string;

  @IsString()
  @IsOptional()
  status: EPaymentStatus;
}
