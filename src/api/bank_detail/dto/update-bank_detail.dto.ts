import { PartialType } from '@nestjs/swagger';
import { CreateBankDetailDto } from './create-bank_detail.dto';

export class UpdateBankDetailDto extends PartialType(CreateBankDetailDto) {}
