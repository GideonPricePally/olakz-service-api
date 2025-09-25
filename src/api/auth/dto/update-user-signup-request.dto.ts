import { PartialType } from '@nestjs/mapped-types';
import { UserSignupRequestDto } from './signup-request.dto';

export class UpdateUserSignupRequestDto extends PartialType(UserSignupRequestDto) {}
