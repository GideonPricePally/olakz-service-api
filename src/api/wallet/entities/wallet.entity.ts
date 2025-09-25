import { BankDetail } from '@/api/bank_detail/entities/bank_detail.entity';
import { Currency } from '@/api/currency/entities/currency.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { User } from '@/api/user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'wallet' })
export class Wallet extends AbstractEntity {
  constructor(data?: Partial<Wallet>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_wallet_id' })
  id!: Uuid;

  readonly PREFIX: string = 'wlet';

  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'int', default: 10 })
  account_number_length: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  available_balance: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  book_balance: string;

  @Column({ type: 'varchar', nullable: true })
  currency_id: string;

  @ManyToOne(() => Currency, (currency) => currency.wallet)
  @JoinColumn({ name: 'currency_id' })
  currency: Relation<Currency>;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Relation<Transaction>[];

  @OneToOne(() => BankDetail, (bank_detail) => bank_detail.is_default, { nullable: true })
  @JoinColumn({ name: 'default_bank_detail' })
  default_bank_detail: Relation<BankDetail>;

  @OneToMany(() => BankDetail, (bankDetails) => bankDetails.wallet)
  bank_details: Relation<BankDetail>[];
}
