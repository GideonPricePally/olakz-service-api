import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from './user.entity';

@Entity('session')
export class Session extends AbstractEntity {
  constructor(data?: Partial<Session>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_session_id',
  })
  id!: Uuid;

  @Column({
    name: 'hash',
    type: 'varchar',
    length: 255,
  })
  hash!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  user_id: Uuid;

  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_session_user',
  })
  @ManyToOne(() => User, (user) => user.sessions)
  user!: Relation<User>;
}
