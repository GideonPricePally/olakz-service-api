import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentVerificationDto {
  @IsString()
  @IsNotEmpty()
  reference: string;
}
