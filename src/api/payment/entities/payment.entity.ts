import { Currency } from '@/api/currency/entities/currency.entity';
import { Transaction } from '@/api/transaction/entities/transaction.entity';
import { EPaymentStatus, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { PaymentProvider } from '@/libs/payment/entities/payment-provider.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'payment' })
export class Payment extends AbstractEntity {
  constructor(data?: Partial<Payment>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_payment_id' })
  id!: Uuid;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  currency_code: string;

  @Column({ type: 'varchar', unique: true })
  reference: string;

  @Column({ type: 'varchar', nullable: true })
  currency_id?: string;

  @ManyToOne(() => Currency, (currency) => currency.payments)
  @JoinColumn({ name: 'currency_id' })
  currency: Relation<Currency>;

  @Column({ type: 'varchar', nullable: true })
  amount_refunded: number;

  @Column({ type: 'varchar', nullable: true })
  provider_id?: string;

  @ManyToOne(() => PaymentProvider, (paymentProvider) => paymentProvider.payments)
  provider: PaymentProvider;

  @Column({ type: 'varchar', nullable: true })
  data?: Record<string, unknown>;

  @Column({ type: 'varchar', nullable: true })
  captured_at: Date | string;

  @Column({ type: 'varchar', nullable: true })
  canceled_at: Date | string;

  @Column({ type: 'enum', enum: EPaymentStatus, nullable: true, default: EPaymentStatus.AWAITING })
  status: EPaymentStatus;

  @Column({ type: 'varchar', default: {} })
  metadata: Record<string, unknown>;

  @Column({ type: 'varchar' })
  idempotency_key: string;

  @OneToMany(() => Transaction, (transaction) => transaction.payment)
  transactions: Relation<Transaction>[];
}
