import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ProspectService } from '../prospect/prospect.service';
import { AdminRoleService } from '../role/admin-role.service';
import { AdminRole } from '../role/entities/admin-role.entity';
import { UserRepository } from '../user/user.repository';
import { ConfigReaderService } from '../utils/config-reader.service';
import { DataManagerService } from '../utils/data-manager.service';
import { UtilityService } from '../utils/utility-service';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly userRepository: UserRepository,
    private readonly config: ConfigReaderService,
    private readonly dataManagerService: DataManagerService,
    private readonly utilityService: UtilityService,
    private readonly adminRoleService: AdminRoleService,
    private readonly authService: AuthService,
    private readonly prospectService: ProspectService,
  ) {}

  async create(createAdminDto: CreateAdminDto, role?: AdminRole): Promise<Admin> {
    const username = createAdminDto.username;
    const randomPassword = this.utilityService.generateReferralCode();
    const password = await this.utilityService.hashPassword(randomPassword);

    const adminRole = role || (await this.adminRoleService.getBaseRole());
    if (!adminRole) throw new NotFoundException('admin role not found');

    const { prospect_id } = await this.authService.signup_request('::1', {
      password,
      t_and_c: true,
      username,
      first_name: 'admin',
      last_name: 'admin',
    });
    const prospect = await this.prospectService.findOne(prospect_id);
    await this.authService.complete_signup_request({ otp: prospect.otps[0], prospect_id });
    const user = await this.userRepository.findOne({ where: { username: prospect.username } });
    await this.dataManagerService.transaction(async (manager) => {
      const adminInstance = this.adminRepository.create({
        roles: [adminRole],
        created_by: SYSTEM_USER_ID,
        updated_by: SYSTEM_USER_ID,
        user,
      });
      await manager.save(Admin, adminInstance);
    });
    return this.adminRepository.findOne({ where: { user: { username: createAdminDto.username } } });
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({ relations: ['user'] });
  }

  async findOne(id: Uuid): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id }, relations: ['user'] });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async update(id: Uuid, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    return this.adminRepository.save(admin);
  }

  async remove(id: Uuid): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }

  async onModuleInit() {
    const adminCount = await this.adminRepository.count();
    if (adminCount === 0) {
      const username = this.config.app.app_username;
      const superAdminRole = await this.adminRoleService.getSuperAdminRole();
      await this.create({ username }, superAdminRole);
    }
  }
}
