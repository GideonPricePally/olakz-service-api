import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tag' })
export class Tag extends AbstractEntity {
  constructor(data?: Partial<Tag>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_tag_id' })
  id!: Uuid;

  readonly PREFIX: string = 'tag';

  @Column({ unique: true })
  @Index({ unique: true })
  name: string; // e.g. "music", "fashion", "urgent"

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  is_system_tag: boolean; // If system-created and immutable
}
