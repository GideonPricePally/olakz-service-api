import { BooleanField, StringField, StringFieldOptional } from '@/decorators/field.decorators';
import { Username } from '@/decorators/username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

export class UserSignupRequestDto {
  @StringField({ description: 'unique user firstname' })
  first_name: string;

  @StringField({ description: 'unique user lastname' })
  last_name: string;

  @ApiProperty({ description: 'unique user username' })
  @Validate(Username)
  @IsNotEmpty()
  username: string;

  @StringField({ description: 'user password' })
  password: string;

  @BooleanField({ description: 'boolean agree to terms and conditions' })
  t_and_c: boolean;

  @StringFieldOptional({ description: 'optional invite referral code ' })
  referral_code?: string;
}
