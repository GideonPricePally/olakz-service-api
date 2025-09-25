import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { PrimaryGeneratedColumn } from 'typeorm';

export class Fulfillment extends AbstractEntity {
  constructor(data?: Partial<Fulfillment>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_fulfillment_id' })
  id!: Uuid;
}
