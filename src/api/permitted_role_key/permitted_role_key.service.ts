import { Uuid } from '@/common/types/common.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { CreatePermittedRoleKeyDto } from './dto/create-permitted_role_key.dto';
import { UpdatePermittedRoleKeyDto } from './dto/update-permitted_role_key.dto';
import { PermittedRoleKey } from './entities/permitted_role_key.entity';

@Injectable()
export class PermittedRoleKeysService {
  constructor(
    private readonly roleService: RoleService,
    @InjectRepository(PermittedRoleKey) private readonly prkRepository: Repository<PermittedRoleKey>,
  ) {}

  async create(createPermittedRoleKeyDto: CreatePermittedRoleKeyDto): Promise<PermittedRoleKey> {
    const newPermittedRoleKey = await this.prkRepository.create(createPermittedRoleKeyDto);
    return this.prkRepository.save(newPermittedRoleKey) as Promise<PermittedRoleKey>;
  }

  findAll(): Promise<PermittedRoleKey[]> {
    return this.prkRepository.find();
  }

  findOne(id: Uuid): Promise<PermittedRoleKey> {
    return this.prkRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updatePermittedRoleKeyDto: UpdatePermittedRoleKeyDto): Promise<PermittedRoleKey> {
    await this.prkRepository.update(id, updatePermittedRoleKeyDto);
    return this.findOne(id);
  }

  async remove(id: Uuid): Promise<void> {
    await this.prkRepository.delete(id);
  }
}
