import { Country } from '@/api/country/entities/country.entity';
import { Payment } from '@/api/payment/entities/payment.entity';
import { Region } from '@/api/region/entities/region.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { Wallet } from '@/api/wallet/entities/wallet.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'currency' })
export class Currency extends AbstractEntity {
  constructor(data?: Partial<Currency>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_currency_id' })
  id!: Uuid;

  readonly PREFIX = 'curr';

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  symbol: string;

  @Column({ type: 'varchar' })
  symbol_native: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'boolean', default: false })
  includes_tax?: boolean;

  @OneToMany(() => Country, (country) => country.default_currency)
  countries: Relation<Country>[];

  @OneToMany(() => Wallet, (wallet) => wallet.currency)
  wallet: Relation<Wallet>;

  @OneToMany(() => Region, (region) => region.currency)
  regions: Relation<Region>[];

  @OneToMany(() => Transaction, (transaction) => transaction.currency)
  transactions: Transaction[];

  @OneToMany(() => Payment, (payment) => payment.currency)
  payments: Payment[];
}
