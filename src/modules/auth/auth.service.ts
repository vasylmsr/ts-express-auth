import User from '../../entities/user.entity';
import {getConnection, getManager, getRepository} from 'typeorm';
import HttpException from '../../common/exceptions/HttpException';
import UserService from '../user/user.service';
import IUserTokens from '../../common/interfaces/user.tokens.interface';
import {UNAUTHORIZED} from 'http-status-codes';
import IJwtResponse from '../../common/jwt/jwt.response.interface';
import JwtAccess from '../../common/jwt/jwt.static';
import IJwt from '../../common/jwt/jwt.interface';
import Session from '../../entities/session.entity';

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
      throw new HttpException('Invalid username/password', UNAUTHORIZED);
    } else {
      delete user.password;
      const tokens = await this.userService.createNewSession(user, headers, connection);
      return { user, tokens } as IUserTokens;
    }
  }

  public async signOut(token: string) {
    const { session } = await this.getUserAndSessionFromRefreshToken(token);
    session.isActive = false;
    await getManager().save(Session, session);
    return { message: 'Signout '};
  }

  protected async updateTokens(token): Promise<IJwtResponse> {
    const { user, session } = await this.getUserAndSessionFromRefreshToken(token);
    if (token.split(' ')[1] !== session.refreshToken && session.isActive) {
      throw new HttpException('Not Auth', UNAUTHORIZED);
    }
    const newTokens = await JwtAccess.createTokensPair(user, session);
    session.refreshToken = newTokens.refreshToken;
    await getManager().save(Session, session);
    return newTokens;
  }

  private async getUserAndSessionFromRefreshToken(token: string) {
    let tokenUser;
    try {
      tokenUser = await JwtAccess.verifyRefreshToken(token) as IJwt;
    } catch (err) {
      throw new HttpException('Token expires', UNAUTHORIZED);
    }

    const sessionId = tokenUser.data.sessionId;
    const user = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sessions', 'sessions')
      .where('sessions.id = :id', { id: sessionId })
      .getOne();

    const [ session ] = user.sessions;
    return { user , session };
  }
}
