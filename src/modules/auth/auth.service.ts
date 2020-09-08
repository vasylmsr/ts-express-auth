import {getConnection, getManager} from 'typeorm';
import HttpException from '../../common/exceptions/HttpException';
import {UNAUTHORIZED} from 'http-status-codes';
import IJwtResponse from '../../common/jwt/jwt.response.interface';
import IJwt from '../../common/jwt/jwt.interface';
import IUserTokens from '../../common/interfaces/user.tokens.interface';
import JwtAccess from '../../common/jwt/jwt.static';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import Provider from '../../entities/provider.entity';
import UserService from '../user/user.service';
import Confirmation from '../../entities/confirmation.entity';

type VerifyJwtFunc = (token: string) => Promise<IJwt>;

export default class AuthService {
  private userRepo;
  private userService;
  private providerRepo;
  private confirmationRepo;

  constructor() {
    this.userService = new UserService();
    this.userRepo = getConnection().getRepository(User);
    this.providerRepo = getConnection().getRepository(Provider);
    this.confirmationRepo = getConnection().getRepository(Confirmation);
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
      user.tokens = await this.userService.createNewSession(user, headers, connection);
      return user as IUserTokens;
    }
  }

  public async signInViaSocial(oauthUser, headers, connection) {
    let provider;
    let user;
    provider = await this.providerRepo.findOne({ email: oauthUser.email } );
    if (provider) {
      user = await this.userRepo.findOne({ id: provider.userId });
    } else {
      user = await this.registerUserWithProvider(oauthUser);
    }
    return await this.createSessionAndGetFullUser(user, headers, connection);
  }

  public async signOut(token: string) {
    const { session } = await this.getUserAndSessionFromToken(token, JwtAccess.verifyRefreshToken);
    session.isActive = false;
    await getManager().save(Session, session);
    return { message: 'Sign out '};
  }

  private async createSessionAndGetFullUser(user, headers, connection) {
    const tokens: Session = await this.userService.createNewSession(user, headers, connection);
    user = await this.userService.getUser(user.id);
    user.tokens = tokens;
    return user;
  }

  private async registerUserWithProvider(providerData) {
    const { email, firstName, lastName } = providerData;
    const newUser = await this.userRepo.createAndSave({ email, firstName, lastName });

    await this.providerRepo.createAndSave({
      ...providerData,
      userId: newUser.id,
    });

    await this.confirmationRepo.createAndSave({
      isEmailConfirmed: true,
      userId: newUser.id,
    });

    return newUser;
  }

  protected async updateTokens(token): Promise<IJwtResponse> {
    const { user, session } = await this.getUserAndSessionFromToken(token, JwtAccess.verifyRefreshToken);
    if (token.split(' ')[1] !== session.refreshToken && session.isActive) {
      throw new HttpException('Not Auth', UNAUTHORIZED);
    }
    const newTokens = await JwtAccess.createTokensPair(user, session);
    session.refreshToken = newTokens.refreshToken;
    await getManager().save(Session, session);
    return newTokens;
  }

  public async getUserAndSessionFromToken(token: string, verifyToken: VerifyJwtFunc) {
    let tokenUser: IJwt;
    try {
      tokenUser = await verifyToken(token);
    } catch (err) {
      throw new HttpException(err.name, UNAUTHORIZED);
    }
    const sessionId = tokenUser.sessionId;
    const user = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.sessions', 'sessions')
      .where('sessions.id = :id', { id: sessionId })
      .getOne();
    const [ session ] = user.sessions;
    return { user , session };
  }
}
