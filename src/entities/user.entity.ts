import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Confirmation from './confirmation.entity';
import Session from './session.entity';
import Provider from './provider.entity';
import Account from './account.abstract';

@Entity('users')
export default class User extends Account {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({type: 'varchar', length: 255, select: false, nullable: true})
  password: string;

  @OneToOne(type => Confirmation, confirmation => confirmation.userId)
  confirmation: Confirmation;

  @OneToMany(type => Session, session => session.userId)
  sessions: Session[];

  @OneToMany(type => Provider, provider => provider.user)
  providers: Provider[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(attempt: string): Promise<User> {
    return await bcrypt.compare(attempt, this.password);
  }
}
