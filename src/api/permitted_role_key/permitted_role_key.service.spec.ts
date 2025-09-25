import { Test, TestingModule } from '@nestjs/testing';
import { PermittedRoleKeysService } from './permitted_role_key.service';

describe('PermittedRoleKeysService', () => {
  let service: PermittedRoleKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermittedRoleKeysService],
    }).compile();

    service = module.get<PermittedRoleKeysService>(PermittedRoleKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
