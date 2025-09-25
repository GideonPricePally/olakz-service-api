import { Test, TestingModule } from '@nestjs/testing';
import { FprService } from './fpr.service';

describe('FprService', () => {
  let service: FprService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FprService],
    }).compile();

    service = module.get<FprService>(FprService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
