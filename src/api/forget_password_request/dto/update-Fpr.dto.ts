import { PartialType } from '@nestjs/mapped-types';
import { CreateFprDto } from './create-Fpr.dto';

export class UpdateFprDto extends PartialType(CreateFprDto) {}
