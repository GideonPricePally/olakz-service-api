import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cart' })
export class Cart extends AbstractEntity {
  constructor(data?: Partial<Cart>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_cart_id' })
  id!: Uuid;
}
