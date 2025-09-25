import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(private readonly dataSource: DataSource) {
    super(Admin, dataSource.createEntityManager());
  }
}
