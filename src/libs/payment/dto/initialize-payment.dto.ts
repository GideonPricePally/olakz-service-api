import { IsString } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  amount: string;

  @IsString()
  email: string;

  @IsString()
  reference: string;

  @IsString()
  callback_url: string;
}
