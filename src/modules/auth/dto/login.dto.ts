import { IsEmail, Length } from 'class-validator';

export default class LoginDTO {
	@IsEmail()
	email: string;

	@Length(8, 40)
	password: string;
}
