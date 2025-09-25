import { IsBoolean, IsString } from 'class-validator';

export class CreatePaymentProviderDto {
  @IsString()
  name: string;

  @IsBoolean()
  is_installed: boolean;
}
