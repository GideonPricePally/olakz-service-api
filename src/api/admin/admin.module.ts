import { User } from '@/api/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProspectModule } from '../prospect/prospect.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User]), UtilsModule, RoleModule, UserModule, AuthModule, ProspectModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
