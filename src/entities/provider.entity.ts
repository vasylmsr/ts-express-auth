import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';
import Account from './account.abstract';

export enum ProviderType {
  'google',
}

@Entity('providers')
export default class Provider extends Account {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'provider_type', type: 'enum', enum: ProviderType })
  providerType: ProviderType;

  @Column({ name: 'photo_url', type: 'varchar'})
  photoUrl: string;

  @Column({ name: 'email_verified', type: 'boolean'})
  emailVerified: boolean;

  @Column({ name: 'locale', type: 'varchar', length: 10})
  locale: string;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, user => user.providers, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

}
