import { Region } from '@/api/region/entities/region.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'tax_provider' })
export class TaxProvider extends AbstractEntity {
  constructor(data?: Partial<TaxProvider>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_tax_provider_id' })
  id!: Uuid;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean' })
  is_installed: boolean;

  @OneToMany(() => Region, (region) => region.tax_provider)
  regions: Relation<Region>[];
}
