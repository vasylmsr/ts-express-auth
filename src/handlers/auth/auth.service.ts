import RegisterDTO from './register.dto';
import { getConnection, getRepository, getManager, Connection } from 'typeorm';
import User from '../entities/user.entity';
import HttpException from '../../common/exceptions/HttpException'

export default class AuthService {
	private userRepo;
	constructor(){
		this.userRepo = getConnection().getRepository(User);
	}

	public async addUser(data) {
		console.log(1)
		const existUser = await this.userRepo.find({ email: data.email });
		if(existUser && existUser.length) throw new HttpException('User already exist', 400);
		else {
			const user = await this.userRepo.create({
				password: '11111',
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName
			});
			return this.userRepo.save(user)
		}
		
	}
}