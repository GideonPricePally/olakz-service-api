import { PartialType } from '@nestjs/swagger';
import { CreateFulfillmentDto } from './create-fulfillment.dto';

export class UpdateFulfillmentDto extends PartialType(CreateFulfillmentDto) {}
