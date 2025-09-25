import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UtilsModule } from '../utils/utils.module';
import { PermittedRoleKey } from './entities/permitted_role_key.entity';
import { PermittedRoleKeysController } from './permitted_role_key.controller';
import { PermittedRoleKeysService } from './permitted_role_key.service';

@Module({
  imports: [RoleModule, TypeOrmModule.forFeature([PermittedRoleKey]), UtilsModule],
  controllers: [PermittedRoleKeysController],
  providers: [PermittedRoleKeysService],
})
export class PermittedRoleKeysModule {}
