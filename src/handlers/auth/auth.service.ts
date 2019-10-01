import {getConnection} from 'typeorm';
import User from '../entities/user.entity';
import Confirmation from '../entities/confirmation.entity';
import HttpException from '../../common/exceptions/HttpException';
import {mailInstance} from '../../common/mail/mail';

export default class AuthService {
	private userRepo;
	private confirmationRepo;
	constructor() {
		this.userRepo = getConnection().getRepository(User);
		this.confirmationRepo = getConnection().getRepository(Confirmation);
	}

	public async addUser(data) {
		const existUser = await this.userRepo.find({ email: data.email });
		if (existUser && existUser.length) {
			throw new HttpException('User already exist', 400);
		} else {
			const user = await this.userRepo.create({
				password: data.password,
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
			});
			const code = await this.sendEmailConfirmation(user);
			const confirmation = await this.confirmationRepo.create({ code });
			await this.confirmationRepo.save(confirmation);
			user.confirmation = confirmation.id;
			return await this.userRepo.save(user);
		}
	}

	private async sendEmailConfirmation(user) {
		const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
		await mailInstance.sendMail({
			from: '"Tony Stark 👻" <foo@example.com>',
			to: 'vasymsr@gmail.com',
			subject: `Hello, ${user.firstName} ✔`,
			text: 'Great! You can send test emails!)',
			html: `<div>
      		<p>${user.firstName} ${user.lastName},  Great! You can send test emails!)</p>
      		<p>For confirmation your email enter code <b>${code}</b>
      	</div>
      	`,
		});
	 return String(code);
	}
}
