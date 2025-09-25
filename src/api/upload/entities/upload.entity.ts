import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export class Upload extends AbstractEntity {
  constructor(data?: Partial<Upload>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_upload_id' })
  id!: Uuid;
}
