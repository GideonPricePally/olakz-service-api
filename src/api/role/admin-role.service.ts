import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminRole } from './entities/admin-role.entity';
import { EDefaultAdminRole } from './types/default.role';

@Injectable()
export class AdminRoleService implements OnModuleInit {
  constructor(@InjectRepository(AdminRole) private adminRoleRepository: Repository<AdminRole>) {}

  getRoles(condition?: FindManyOptions<AdminRole>) {
    return this.adminRoleRepository.find(condition);
  }

  async getBaseRoles() {
    return await this.adminRoleRepository.find({ where: { name: In([EDefaultAdminRole.BASIC_ADMIN_ROLE]) } });
  }

  async getBaseRole() {
    return await this.adminRoleRepository.findOne({ where: { name: EDefaultAdminRole.BASIC_ADMIN_ROLE } });
  }

  async getSuperAdminRole() {
    return await this.adminRoleRepository.findOne({ where: { name: EDefaultAdminRole.SUPER_ADMIN_ROLE } });
  }

  async getBaseRoleByName(name: EDefaultAdminRole) {
    return await this.adminRoleRepository.findOne({ where: { name } });
  }

  async getCustomerBaseRole() {
    return await this.adminRoleRepository.findOne({ where: { name: EDefaultAdminRole.BASIC_ADMIN_ROLE } });
  }

  async create(createRoleDto: CreateRoleDto): Promise<AdminRole> {
    const newRole = await this.adminRoleRepository.create(createRoleDto);
    return this.adminRoleRepository.save(newRole);
  }

  findAll(): Promise<AdminRole[]> {
    return this.getRoles();
  }

  findOne(id: Uuid): Promise<AdminRole> {
    return this.adminRoleRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updateRoleDto: UpdateRoleDto): Promise<AdminRole> {
    await this.adminRoleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.adminRoleRepository.delete(id);
  }

  async onModuleInit() {
    const adminRoleCount = await this.adminRoleRepository.count();
    if (adminRoleCount === 0) {
      const adminRoleInstances = await Promise.all(
        Object.values(EDefaultAdminRole)?.map(async (role): Promise<AdminRole> => {
          return this.adminRoleRepository.create({ name: role, priority_level: 1, created_by: SYSTEM_USER_ID, updated_by: SYSTEM_USER_ID });
        }),
      );

      await this.adminRoleRepository.save(adminRoleInstances);
    }
  }
}
