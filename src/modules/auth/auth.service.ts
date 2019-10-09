import User from '../../entities/user.entity';
import { getConnection } from 'typeorm';
import HttpException from '../../common/exceptions/HttpException';
import UserService from '../user.service';
import IUserTokens from '../../common/interfaces/user.tokens.interface';

export default class AuthService {
  private userRepo;
  private userService;

  constructor() {
    this.userService = new UserService();
    this.userRepo = getConnection().getRepository(User);
  }

  public async signIn({email, password}, headers, connection): Promise<IUserTokens> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.confirmation', 'confirmation')
      .addSelect('user.password')
      .where('user.email = :email', {email})
      .getOne();
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid username/password', 400);
    } else {
      delete user.password;
      const tokens = await this.userService.createNewSession(user, headers, connection);
      return { user, tokens } as IUserTokens;
    }
  }
}
