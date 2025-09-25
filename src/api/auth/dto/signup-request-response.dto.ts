import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupRequestResponseDto {
  @ApiProperty({ description: 'prospect request_id', type: String })
  @IsString()
  @IsNotEmpty()
  prospect_id: string;

  @ApiProperty({ description: 'otp time to live', type: String })
  @IsNumber()
  @IsNotEmpty()
  otp_ttl: number;

  @ApiProperty({ description: 'time otp got generated', type: String })
  @IsString()
  @IsNotEmpty()
  otp_created_at: string;
}
