import { Country } from '@/api/country/entities/country.entity';
import { Currency } from '@/api/currency/entities/currency.entity';
import { FulfillmentProvider } from '@/api/fulfillment/entities/fulfillment-provider.entity';
import { TaxProvider } from '@/api/tax-rate/entities/tax-provider.entity';
import { TaxRate } from '@/api/tax-rate/entities/tax-rate.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { PaymentProvider } from '@/libs/payment/entities/payment-provider.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { RegionStatus } from '../region.type';

@Entity({ name: 'region' })
export class Region extends AbstractEntity {
  constructor(data?: Partial<Region>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_region_id' })
  id!: Uuid;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  currency_code: string;

  @ManyToOne(() => Currency, (currency) => currency.regions)
  @JoinColumn({ name: 'currency_id' })
  currency: Relation<Currency>;

  @OneToMany(() => TaxRate, (taxRate) => taxRate.region)
  tax_rates: Relation<TaxRate>[] | null;

  @Column({ type: 'boolean', default: false })
  gift_cards_taxable: boolean;

  @Column({ type: 'boolean' })
  automatic_taxes: boolean;

  @OneToMany(() => Country, (country) => country.region)
  countries: Relation<Country>[];

  @ManyToOne(() => TaxProvider, (tp) => tp.regions)
  @JoinColumn({ name: 'tax_provider_id' })
  tax_provider: Relation<TaxProvider>;

  @OneToMany(() => PaymentProvider, (paymentProvider) => paymentProvider.region)
  payment_providers: Relation<PaymentProvider>[];

  @ManyToMany(() => FulfillmentProvider, (fulfillmentProvider) => fulfillmentProvider.regions)
  @JoinTable({
    name: 'region_fulfillment_provider_fulfillment_provider_region',
  })
  fulfillment_providers: Relation<FulfillmentProvider>[];

  @Column({ type: 'jsonb' })
  metadata: Record<string, unknown>;

  @Column({ type: 'boolean' })
  includes_tax: boolean;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'enum', enum: RegionStatus, default: RegionStatus.DRAFT })
  status: RegionStatus;
}
