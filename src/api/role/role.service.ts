import { Uuid } from '@/common/types/common.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminRole } from './entities/admin-role.entity';
import { Role } from './entities/user-role.entity';
import { EDefaultUserRole, userRoles } from './types/default.role';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(AdminRole) private adminRoleRepository: Repository<AdminRole>,
  ) {}

  getRoles(condition?: FindManyOptions<Role>) {
    return this.roleRepository.find(condition);
  }

  async getBaseRoles() {
    return await this.roleRepository.find({ where: { value: EDefaultUserRole.REGULAR_USER } });
  }

  async getBaseRole() {
    return await this.roleRepository.findOne({ where: { value: EDefaultUserRole.REGULAR_USER } });
  }

  async getBaseRoleByName(value: EDefaultUserRole = EDefaultUserRole.REGULAR_USER) {
    return await this.roleRepository.findOne({ where: { value } });
  }

  async getCustomerBaseRole() {
    return await this.roleRepository.findOne({ where: { value: EDefaultUserRole.REGULAR_USER } });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = await this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole) as Promise<Role>;
  }

  findAll(): Promise<Role[]> {
    return this.getRoles();
  }

  async findExternalUserRoles() {
    return { roles: await this.roleRepository.find({ where: { is_external: true } }) };
  }

  findOne(id: Uuid): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async onModuleInit() {
    const userRoleCount = await this.roleRepository.count();
    if (userRoleCount === 0) {
      const create_instances = await Promise.all(
        userRoles.map(async (item): Promise<Role> => {
          return this.roleRepository.create({
            value: item.value,
            display_name: item.displayName,
            is_external: item.isExternalResource,
            created_by: SYSTEM_USER_ID,
            updated_by: SYSTEM_USER_ID,
          });
        }),
      );

      await this.roleRepository.save(create_instances);
    }
  }
}
