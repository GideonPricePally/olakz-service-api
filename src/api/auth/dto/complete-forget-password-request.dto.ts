import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CompleteForgetPasswordRequestDto {
  @ApiProperty({ description: 'user fpr_id', type: String })
  @IsUUID()
  @IsNotEmpty()
  fpr_id: string;

  @ApiProperty({ description: 'otp', type: String })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'user password', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;
}
