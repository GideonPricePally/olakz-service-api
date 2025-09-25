import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteSignupRequestDto {
  @IsString()
  @IsNotEmpty()
  prospect_id: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
