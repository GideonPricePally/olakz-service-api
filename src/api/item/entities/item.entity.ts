import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'item' })
export class Item extends AbstractEntity {
  constructor(data?: Partial<Item>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_item_id' })
  id!: Uuid;
}
