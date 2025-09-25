import { Action, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PermittedRoleKey } from '../../permitted_role_key/entities/permitted_role_key.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'user_role' })
export class Role extends AbstractEntity {
  constructor(data?: Partial<Role>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_role_id' })
  id!: Uuid;

  readonly PREFIX = 'role';

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @Column({ type: 'varchar', nullable: false })
  display_name: string;

  @Column({ type: 'int', default: 1 })
  priority_level: number;

  @Column({ type: 'boolean', default: false })
  is_external: boolean;

  @OneToMany(() => PermittedRoleKey, (prk) => prk.role)
  permitted_keys: Relation<PermittedRoleKey>[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Column('text', { array: true, default: [] })
  actions: Action[];
}
