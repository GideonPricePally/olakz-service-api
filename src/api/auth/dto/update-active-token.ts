import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateActiveTokenDto {
  @IsString()
  @IsNotEmpty()
  active_token: string;

  @IsString()
  @IsNotEmpty()
  token_created_date: string;
}
