import { IsEmail, MinLength, MaxLength } from 'class-validator';

export default class RegisterDTO {
	@IsEmail()
	email: string;

	@MinLength(8)
	@MaxLength(40)
	password: string;

	@MinLength(8)
	@MaxLength(40)
	firstName: string;

	@MinLength(8)
	@MaxLength(40)
	lastName: string;
}
