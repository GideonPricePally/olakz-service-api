import { Username } from '@/decorators/username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

export class UserSigninDto {
  @ApiProperty({ description: 'unique user username', type: String })
  @Validate(Username)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'user password', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;
}
