import RegisterDTO from './register.dto';
import { getConnection, getRepository, getManager, Connection } from 'typeorm';
import User from '../entities/user.entity';
export default class AuthService {
	public addUser(data) {
		return getRepository(User).findOne({email: "SDDS"});
	}
}