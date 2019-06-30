import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar"})
  email: string;

  @Column({type: "varchar", length: 30})
  password: string;

  @Column({name: 'first_name', type: "varchar", length: 30})
  firstName: string;

  @Column({name: 'last_name', type: "varchar", length: 30})
  lastName: string;
}