import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'email', type: "varchar", unique: true, length: 40 })
  email: string;

  @Column({type: "varchar", length: 255})
  password: string;

  @Column({name: 'first_name', type: "varchar", length: 28})
  firstName: string;

  @Column({name: 'last_name', type: "varchar", length: 27})
  lastName: string;

  @BeforeInsert()
  async hashPassword() {
    var salt = bcrypt.genSaltSync(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
}