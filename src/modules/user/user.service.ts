import { getConnection } from 'typeorm';
import * as geo from 'geoip-lite';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import HttpException from '../../common/exceptions/HttpException';
import JwtAccess from '../../common/jwt/jwt.static';
import {BAD_REQUEST} from 'http-status-codes';

export default class UserService {
  private readonly sessionRepo;
  constructor() {
    this.sessionRepo = getConnection().getRepository(Session);
  }

  public async getUser(id: number) {
    const user = await getConnection().getRepository(User)
      .findOne({
        relations: ['confirmation', 'sessions', 'providers'],
        where: { id },
      });
    if (!user) {
      throw new HttpException('User does not exist', BAD_REQUEST);
    }
    return user;
  }

  protected async createNewSession(user, headers, connection) {
    const ip = headers['X-Forwarded-For'] || headers['x-forwarded-for'] || connection.remoteAddress;
    const timezone = geo.lookup('195.12.59.20').timezone;
    const session = await this.sessionRepo.createAndSave({
      userId: user.id,
      isActive: true,
      timezone,
      ip,
    });
    const tokens = JwtAccess.createTokensPair(user, session);
    session.refreshToken = tokens.refreshToken;
    await this.sessionRepo.save(session);
    return tokens;
  }
}
