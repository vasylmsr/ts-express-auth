import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';

@Entity('sessions')
export default class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @Column({ name: 'is_active', type: 'boolean', nullable: false })
  isActive: boolean;

  @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: true})
  refreshToken: string;

  @Column({type: 'varchar', length: 128})
  ip: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  timezone: string;

  @ManyToOne(type => User, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id'})
  userId: User;

}
