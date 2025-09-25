import { AdminRole } from '@/api/role/entities/admin-role.entity';
import { User } from '@/api/user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin extends AbstractEntity {
  constructor(data?: Partial<Admin>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_admin_id' })
  id!: Uuid;

  @ManyToMany(() => AdminRole, (adminRole) => adminRole.admins)
  @JoinTable({ name: 'admin_role_role_admin' })
  roles: AdminRole[];

  @Column({ type: 'varchar', nullable: true })
  user_id?: string;

  @OneToOne(() => User, (user) => user.admin)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
