import { Username } from '@/decorators/username.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'unique user username', type: String })
  @Validate(Username)
  @IsNotEmpty()
  username: string;
}
