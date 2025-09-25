import { User } from '@/api/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('account')
export class Account {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  accountId: string;

  @Column({ type: 'text' })
  providerId: string;

  @Column({ type: 'text' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'text', nullable: true })
  accessToken?: string;

  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  @Column({ type: 'text', nullable: true })
  idToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  accessTokenExpiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  scope?: string;

  @Column({ type: 'text', nullable: true })
  password?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
