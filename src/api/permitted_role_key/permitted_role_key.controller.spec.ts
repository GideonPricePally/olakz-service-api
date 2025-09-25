import { Test, TestingModule } from '@nestjs/testing';
import { PermittedRoleKeysController } from './permitted_role_key.controller';
import { PermittedRoleKeysService } from './permitted_role_key.service';

describe('PermittedRoleKeysController', () => {
  let controller: PermittedRoleKeysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermittedRoleKeysController],
      providers: [PermittedRoleKeysService],
    }).compile();

    controller = module.get<PermittedRoleKeysController>(PermittedRoleKeysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
