import { BankDetail } from '@/api/bank_detail/entities/bank_detail.entity';
import { Region } from '@/api/region/entities/region.entity';
import { User } from '@/api/user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Currency } from '../../currency/entities/currency.entity';
import { Prospect } from '../../prospect/entities/prospect.entity';

@Entity({ name: 'country' })
export class Country extends AbstractEntity {
  constructor(data?: Partial<Country>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_country_id' })
  id!: Uuid | string;

  readonly PREFIX = 'ctry';

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  short_name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  unix_flag_code: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  thumbnail_url: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  emoji_flag: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @OneToMany(() => Prospect, (prospect) => prospect.country)
  prospects: Relation<Prospect>[];

  @OneToMany(() => User, (user) => user.country)
  users: Relation<User>[];

  @ManyToOne(() => Currency, (currency) => currency.countries)
  @JoinColumn({ name: 'default_currency_id' })
  default_currency: Relation<Currency>;

  @ManyToOne(() => Region, (region) => region.countries)
  region: Relation<Region>;

  @OneToMany(() => BankDetail, (bank) => bank.country)
  bank_details: Relation<BankDetail>[];
}
