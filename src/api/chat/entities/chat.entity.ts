import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat' })
export class Chat extends AbstractEntity {
  constructor(data?: Partial<Chat>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_chat_id' })
  id!: Uuid;

  readonly PREFIX: string = 'chat';
}
