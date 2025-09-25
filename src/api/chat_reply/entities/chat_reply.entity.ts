import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat_reply' })
export class ChatReply extends AbstractEntity {
  constructor(data?: Partial<ChatReply>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_chat_reply_id' })
  id!: Uuid;

  readonly PREFIX: string = 'chtrply';
}
