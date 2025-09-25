import { Country } from '@/api/country/entities/country.entity';
import { EDefaultUserRole } from '@/api/role/types/default.role';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'prospect' })
export class Prospect extends AbstractEntity {
  constructor(data?: Partial<Prospect>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_prospect_id' })
  id!: Uuid;

  readonly PREFIX = 'prosp';

  @Column({ type: 'varchar', nullable: false, default: 'regular_user' })
  type_of_user: EDefaultUserRole;

  @Column({ nullable: false, unique: true })
  @Index('UQ_prospect_username', { where: '"deleted_at" IS NULL', unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  first_name: string;

  @Column({ nullable: false, unique: true })
  last_name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'boolean' })
  t_and_c: boolean;

  @ManyToOne(() => Country, (country) => country.prospects)
  @JoinColumn({ name: 'country_id' })
  country: Relation<Country>;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  otps: string[];

  @Column({ type: 'varchar' })
  otp_created_at: string;

  @Column({ type: 'varchar', default: '' })
  signup_completed_at: string;

  @Column({ type: 'int' })
  otp_ttl: number;

  @Column({ type: 'int' })
  no_of_request_tries: number;

  @Column({ type: 'int', default: 0 })
  request_tries_multiple: number;

  @ManyToOne(() => User, (user) => user.prospects)
  @JoinColumn({ name: 'user_id' })
  referrer: Relation<User>;
}
