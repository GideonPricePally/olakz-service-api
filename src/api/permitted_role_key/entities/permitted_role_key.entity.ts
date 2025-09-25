import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Role } from '../../role/entities/user-role.entity';

@Entity({ name: 'permitted_role_key' })
export class PermittedRoleKey extends AbstractEntity {
  constructor(data?: Partial<PermittedRoleKey>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_permitted_role_key_id' })
  id!: Uuid;

  readonly PREFIX = 'prk';

  @Column({ nullable: false })
  resource_name: string;

  @ManyToOne(() => Role, (role) => role.permitted_keys)
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @Column('text', { array: true, default: [] })
  resource_keys: string[];
}
