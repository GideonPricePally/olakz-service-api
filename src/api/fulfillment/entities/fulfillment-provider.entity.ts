import { Region } from '@/api/region/entities/region.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'fulfillment_provider' })
export class FulfillmentProvider extends AbstractEntity {
  constructor(data?: Partial<FulfillmentProvider>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_fulfillment_provider_id' })
  id!: Uuid;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean' })
  is_installed: boolean;

  @ManyToMany(() => Region, (region) => region.fulfillment_providers)
  regions: Relation<Region>[];
}
