import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcryptjs';

@Entity('confirmations')
export default class Confirmation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'email_code', type: 'varchar', length: 255, nullable: true })
	code: string;

	@Column({ name: 'is_email_confirmed', type: 'boolean', default: false })
	isEmailConfirmed: boolean;
}
