import { StringField } from '@/decorators/field.decorators';
import { Username } from '@/decorators/username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';

export class UserSignupRequestDto {
  @ApiProperty({ description: 'unique user firstname', type: String })
  @StringField()
  first_name: string;

  @ApiProperty({ description: 'unique user lastname', type: String })
  @StringField()
  last_name: string;

  @ApiProperty({ description: 'unique user username', type: String })
  @Validate(Username)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'user password', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'boolean agree to terms and conditions', type: String })
  @IsBoolean()
  @IsNotEmpty()
  t_and_c: boolean;

  @ApiProperty({ description: 'optional invite referral code ', type: String })
  @IsString()
  @IsOptional()
  referral_code?: string;
}
