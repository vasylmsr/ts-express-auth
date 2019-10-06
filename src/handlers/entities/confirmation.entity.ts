import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import User from './user.entity';

@Entity('confirmations')
export default class Confirmation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'email_code', type: 'smallint', nullable: true, select: false })
	emailCode: number;

	@Column({ name: 'is_email_confirmed', type: 'boolean', default: false })
	isEmailConfirmed: boolean;

	@OneToOne(type => User, user => user.confirmation, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	userId: User;
}
