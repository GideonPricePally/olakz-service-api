import { IsNotEmpty, IsString } from 'class-validator';

export class SocialAuthDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
