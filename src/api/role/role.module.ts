import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { AdminRoleService } from './admin-role.service';
import { AdminRole } from './entities/admin-role.entity';
import { Role } from './entities/user-role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, AdminRole]), UtilsModule],
  controllers: [RoleController],
  providers: [RoleService, AdminRoleService],
  exports: [RoleService, AdminRoleService],
})
export class RoleModule {}
