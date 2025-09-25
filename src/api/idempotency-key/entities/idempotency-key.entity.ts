import { EIdempotencyKeyStatus, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'idempotency_key' })
export class IdempotencyKey extends AbstractEntity {
  constructor(data?: Partial<IdempotencyKey>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_idempotency_key_id' })
  id!: Uuid;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar' })
  request_hash: string;

  @Column({ type: 'jsonb', nullable: true })
  response: Record<string, any>;

  @Column({ type: 'enum', enum: EIdempotencyKeyStatus, default: EIdempotencyKeyStatus.IN_PROGRESS })
  status: EIdempotencyKeyStatus;
}
