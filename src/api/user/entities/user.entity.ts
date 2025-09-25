import { Admin } from '@/api/admin/entities/admin.entity';
import { Country } from '@/api/country/entities/country.entity';
import { Prospect } from '@/api/prospect/entities/prospect.entity';
import { Role } from '@/api/role/entities/user-role.entity';
import { Wallet } from '@/api/wallet/entities/wallet.entity';
import { AccountStatus } from '@/common/types/account.type';
import { Gender, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Session } from './session.entity';

@Entity('user')
export class User extends AbstractEntity {
  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Index('UQ_user_username', { where: '"deleted_at" IS NULL', unique: true })
  @Column({ unique: true })
  username: string;

  @Column({ type: 'varchar' })
  name: string;

  @Index('UQ_user_email', { where: '"deleted_at" IS NULL', unique: true })
  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'text', default: 'Hi, I am new to Microtask' })
  bio?: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  thumbnail: string;

  @Column({ type: 'varchar' })
  updated_username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  @Index('UQ_user_referral', { where: '"deleted_at" IS NULL', unique: true })
  referral_code: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Column({ type: 'varchar', length: 20, default: '' })
  first_name: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  @Index('UQ_user_mobile', { where: '"deleted_at" IS NULL', unique: true })
  mobile: string;

  @Column({ type: 'boolean', nullable: true })
  whatsapp_verified: boolean;

  @Column({ type: 'boolean', nullable: true })
  email_verified: boolean;

  @Column({ type: 'boolean' })
  t_and_c: boolean;

  @Column({ type: 'varchar', nullable: true })
  active_token: string;

  @Column({ type: 'varchar', nullable: true })
  refresh_token: string;

  @Column({ type: 'varchar', nullable: true })
  token_expires: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @Column({ type: 'boolean', default: false })
  is_onboarded: boolean;

  @Column({ type: 'varchar', nullable: true })
  wallet_id: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Relation<Wallet>;

  @Column({ type: 'varchar', nullable: true })
  role_id?: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @Column({ type: 'varchar', nullable: true })
  country_id?: string;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Relation<Country>;

  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  @JoinColumn({ name: 'referrer_id' })
  referrer: Relation<User>;

  @OneToMany(() => User, (user) => user.referrer)
  referrals: User[];

  @OneToMany(() => Prospect, (prospect) => prospect.referrer)
  prospects: Prospect[];

  @OneToMany(() => Session, (session) => session.user)
  sessions?: Session[];

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   if (this.password) {
  //     this.password = await hashPass(this.password);
  //   }
  // }
}
