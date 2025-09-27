import { Test, TestingModule } from '@nestjs/testing';
import { FormCollectionController } from './contact-message.controller';
import { ContactMessageService } from './contact-message.service';

describe('FormCollectionController', () => {
  let controller: FormCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormCollectionController],
      providers: [ContactMessageService],
    }).compile();

    controller = module.get<FormCollectionController>(FormCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
