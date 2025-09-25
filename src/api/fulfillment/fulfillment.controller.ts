import { Controller } from '@nestjs/common';
import { FulfillmentService } from './fulfillment.service';

@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}
}
