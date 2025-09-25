import { Admin } from '@/api/admin/entities/admin.entity';
import { Action, Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { PermittedRoleKey } from '../../permitted_role_key/entities/permitted_role_key.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'admin_role' })
export class AdminRole extends AbstractEntity {
  constructor(data?: Partial<AdminRole>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_admin_role_id' })
  id!: Uuid;

  readonly PREFIX = 'role';

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', default: 1 })
  priority_level: number;

  @OneToMany(() => PermittedRoleKey, (prk) => prk.role)
  permitted_keys: PermittedRoleKey[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @Column('text', { array: true, default: [] })
  actions: Action[];

  @ManyToMany(() => Admin, (admin) => admin.roles)
  admins: Relation<Admin>[];
}
