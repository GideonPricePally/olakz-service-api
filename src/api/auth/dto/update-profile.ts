import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  updated_username: string;

  @IsString()
  @IsOptional()
  last_name: string;
}
