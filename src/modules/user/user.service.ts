import {getManager, getConnection} from 'typeorm';
import * as geo from 'geoip-lite';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import HttpException from '../../common/exceptions/HttpException';
import JwtAccess from '../../common/jwt/jwt.static';
import {BAD_REQUEST} from 'http-status-codes';

export default class UserService {
  public async getUser(id: number) {
    const user = await getConnection().getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.confirmation', 'confirmation')
      .where('user.id = :id', {id})
      .getOne();
    if (!user) {
      throw new HttpException('User does not exist', BAD_REQUEST);
    } else {
      return user;
    }
  }

  protected async createNewSession(user, headers, connection) {
    const ip = headers['X-Forwarded-For'] || headers['x-forwarded-for'] || connection.remoteAddress;
    const timezone = geo.lookup('195.12.59.20').timezone;
    let session = await getManager().create(Session, {
      userId: user.id,
      isActive: true,
      timezone,
      ip,
    });
    session = await getManager().save(Session, session);
    const tokens = JwtAccess.createTokensPair(user, session);
    session.refreshToken = tokens.refreshToken;
    await getManager().save(Session, session);
    return tokens;
  }
}
