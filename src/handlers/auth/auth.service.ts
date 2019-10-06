import { getConnection } from 'typeorm';
import User from '../entities/user.entity';
import Confirmation from '../entities/confirmation.entity';
import HttpException from '../../common/exceptions/HttpException';
import { mailInstance } from '../../common/mail/mail';
import { FRONT_URL } from '../../common/constants';
import RegisterDTO from './dto/register.dto';
import ConfirmationEmailDTO from './dto/сonfirmation.email.dto';

export default class AuthService {
	private userRepo;
	private confirmationRepo;
	constructor() {
		this.userRepo = getConnection().getRepository(User);
		this.confirmationRepo = getConnection().getRepository(Confirmation);
	}

	public async addUser(data: RegisterDTO): Promise<User> {
		const existedUser = await this.userRepo.findOne({email: data.email});
		if (existedUser) {
			throw new HttpException('User already exist', 400);
		} else {
				const { email, password, firstName, lastName } = data;
				let user = await this.userRepo.create({ password, email, firstName, lastName });
				user = await this.userRepo.save(user);
				const emailCode = this.sendEmailConfirmation(user);
				const confirmation = await this.confirmationRepo.create({ emailCode,  userId: user.id });
				await this.confirmationRepo.save(confirmation);
				return await this.getOneUser(user.id);
		}
	}

	public async confirmUserEmail(data: ConfirmationEmailDTO, id): Promise<User> {
		const user = await this.userRepo
			.createQueryBuilder('user')
			.leftJoin('user.confirmation', 'confirmation')
			.addSelect(['confirmation.emailCode', 'confirmation.isEmailConfirmed', 'confirmation.userId'])
			.where('user.id = :id', {id})
			.getOne();
		if (user) {
			if (user.confirmation.isEmailConfirmed) {
				throw new HttpException('Email is confirmed', 400);
			} else if (user.confirmation.emailCode === data.code) {
				user.confirmation.isEmailConfirmed = true;
				await this.confirmationRepo.save(user.confirmation);
				delete user.confirmation.emailCode;
				return user;
			} else  {
				throw new HttpException('Code does not match', 400);
			}
		} else { throw new HttpException('User does not exist', 400); }
	}

	private async getOneUser(userId: number): Promise<User> {
		return await this.userRepo.findOne({ where: { id: userId }, relations: ['confirmation']});
	}

	private sendEmailConfirmation(user: User): number {
		const code = Math.floor(Math.random() * (9999 - 1000) + 1000);
		mailInstance.sendMail({
			from: '"Vasyl Mysiura 👻" <foo@example.com>',
			to: user.email,
			subject: `Hello, ${user.firstName} ✔`,
			text: 'Great! You can send test emails!)',
			html: `<div>
      		<p>${user.firstName} ${user.lastName},  Great! You can send test emails!)</p>
      		<p>For confirmation your email enter the link
      			<a href="${FRONT_URL}?${code}">Continue registration</a>
      			or enter code <b>${code}</b>
      	</div>
      	`,
		});
	 return code;
	}
}
