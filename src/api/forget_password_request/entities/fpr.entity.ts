import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fpr_request' })
export class FPR extends AbstractEntity {
  constructor(data?: Partial<FPR>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_fpr_id' })
  id!: Uuid;

  readonly PREFIX = 'fpr';

  @Column({ unique: true })
  @Index('UQ_fpr_username', { where: '"deleted_at" IS NULL', unique: true })
  username: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  otps: string[];

  @Column({ type: 'varchar' })
  otp_created_at: string;

  @Column({ type: 'int' })
  otp_ttl: number;

  @Column({ type: 'int' })
  no_of_request_tries: number;

  @Column({ type: 'int', default: 0 })
  request_tries_multiple: number;

  @Column({ type: 'varchar', default: '' })
  request_completed_at: string;
}
