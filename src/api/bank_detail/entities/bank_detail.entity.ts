import { Country } from '@/api/country/entities/country.entity';
import { Wallet } from '@/api/wallet/entities/wallet.entity';
import { BankDetailStatus } from '@/common/types/account.type';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'bank_detail' })
export class BankDetail extends AbstractEntity {
  constructor(data?: Partial<BankDetail>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_bank_detail_id' })
  id!: Uuid;

  readonly PREFIX: string = 'bnkd';

  @Column({ type: 'varchar', nullable: true })
  wallet_id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.bank_details)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Relation<Wallet>;

  @Column({ type: 'varchar' })
  bank_code: string;

  @Column({ type: 'varchar' })
  bank_name: string;

  @Column({ type: 'varchar' })
  account_number: string;

  @ManyToOne(() => Country, (country) => country.bank_details)
  country: Relation<Country>;

  @OneToOne(() => Wallet, (wallet) => wallet.default_bank_detail)
  is_default: Relation<Wallet>;

  @Column({ type: 'enum', enum: BankDetailStatus, default: BankDetailStatus.ACTIVE })
  status: BankDetailStatus;
}
