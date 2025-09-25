import { Test, TestingModule } from '@nestjs/testing';
import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentService } from './fulfillment.service';

describe('FulfillmentController', () => {
  let controller: FulfillmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FulfillmentController],
      providers: [FulfillmentService],
    }).compile();

    controller = module.get<FulfillmentController>(FulfillmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
