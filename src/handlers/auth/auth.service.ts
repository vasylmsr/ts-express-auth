import RegisterDTO from './register.dto';
import { getConnection, getRepository, getManager, Connection } from 'typeorm';
import User from '../entities/user.entity';

export default class AuthService {
	private userRepo;
	constructor(){
		this.userRepo = getRepository(User);
	}

	public async addUser(data) {
		const existUser = await this.userRepo.find({ id: data.id });
		if(existUser) {
			const err =  new Error();
			err.name = "HttpException"
			throw err;
		}
		return this.userRepo.save({
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName
		});
	}
}