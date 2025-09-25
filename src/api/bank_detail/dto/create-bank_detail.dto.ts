import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankDetailDto {
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;
}
