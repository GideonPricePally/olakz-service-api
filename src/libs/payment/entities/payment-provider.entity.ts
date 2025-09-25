import { Payment } from '@/api/payment/entities/payment.entity';
import { Region } from '@/api/region/entities/region.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { EProviderName } from '../types/provider-name';

@Entity({ name: 'payment_provider' })
export class PaymentProvider extends AbstractEntity {
  constructor(data?: Partial<PaymentProvider>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_payment_provider_id' })
  id!: Uuid;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  is_installed: boolean;

  @Column({ type: 'boolean', default: false })
  is_base: boolean;

  @ManyToOne(() => Region, (region) => region.payment_providers)
  region: Relation<Region>;

  @Index('UQ_payment_provider_slug', { where: '"deleted_at" IS NULL and "is_installed" IS TRUE', unique: true })
  @Column({ type: 'varchar' })
  slug: EProviderName;

  @OneToMany(() => Payment, (payment) => payment.provider)
  payments: Payment[];
}
