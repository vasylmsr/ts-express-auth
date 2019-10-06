import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import Confirmation from './confirmation.entity';

@Entity('users')
export default class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({name: 'email', type: 'varchar', unique: true, length: 40 })
	email: string;

	@Column({type: 'varchar', length: 255, select: false})
	password: string;

	@Column({name: 'first_name', type: 'varchar', length: 28})
	firstName: string;

	@Column({name: 'last_name', type: 'varchar', length: 27})
	lastName: string;

	@OneToOne(type => Confirmation, confirmation => confirmation.userId)
	confirmation: Confirmation;

	@BeforeInsert()
	async hashPassword() {
		const salt = bcrypt.genSaltSync(12);
		this.password = await bcrypt.hash(this.password, salt);
	}
}
