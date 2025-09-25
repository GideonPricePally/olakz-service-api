import { Currency } from '@/api/currency/entities/currency.entity';
import { Payment } from '@/api/payment/entities/payment.entity';
import { Wallet } from '@/api/wallet/entities/wallet.entity';
import { TransactionType } from '@/common/types/account.type';
import { EPaymentStatus, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'transaction' })
export class Transaction extends AbstractEntity {
  constructor(data?: Partial<Transaction>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_transaction_id' })
  id!: Uuid;

  readonly PREFIX: string = 'trans';

  @ManyToOne(() => Currency, (currency) => currency.transactions, {})
  @JoinColumn({ name: 'currency_id' })
  currency: Relation<Currency>;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Relation<Wallet>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  currency_code: string;

  @Column({ type: 'varchar', nullable: true })
  currency_id?: string;

  @Column({ type: 'varchar', nullable: true })
  data?: Record<string, unknown>;

  @Column({ type: 'enum', enum: EPaymentStatus, nullable: true, default: EPaymentStatus.AWAITING })
  status: EPaymentStatus;

  @ManyToOne(() => Payment, (payment) => payment.transactions, { nullable: true })
  payment: Relation<Payment>;

  @Column({ type: 'varchar', default: {} })
  metadata: Record<string, unknown>;
}
