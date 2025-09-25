import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order' })
export class Order extends AbstractEntity {
  constructor(data?: Partial<Order>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_order_id' })
  id!: Uuid;
}
