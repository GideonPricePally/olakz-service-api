import { Region } from '@/api/region/entities/region.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'tax_rate' })
export class TaxRate extends AbstractEntity {
  constructor(data?: Partial<TaxRate>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_tax_rate_id' })
  id!: Uuid;

  @Column({ type: 'decimal' })
  rate: number | null;

  @Column({ type: 'varchar' })
  code: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  region_id: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  // platforms: Relation<Platform>[];

  @ManyToOne(() => Region, (region) => region.tax_rates)
  region: Relation<Region>;
}
