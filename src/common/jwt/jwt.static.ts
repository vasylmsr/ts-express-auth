import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import IJwt from './jwt.interface';
import * as momentTimezone from 'moment-timezone';
dotenv.config();
export default abstract class JwtAccess {
  static readonly accessExpiresIn = 10 * 60; // 10m
  static readonly refreshExpiresIn = 30 * 24 * 60 * 60; // 30d

  static readonly jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  static readonly jwtAccessExpires = Date.now() + JwtAccess.accessExpiresIn;

  static readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  static readonly jwtRefreshExpires = Date.now() + JwtAccess.refreshExpiresIn;

  static signToken(user, session, type) {
    return jwt.sign({
        data: {
          userId: user.id,
          email: user.email,
          sessionId: session.id,
        },
        exp: type === 'access' ? JwtAccess.jwtAccessExpires : JwtAccess.jwtRefreshExpires,
      },
      type === 'access' ? JwtAccess.jwtAccessSecret : JwtAccess.jwtRefreshSecret,
    );
  }

  static createAccessToken(user: User, session: Session): string {
    return JwtAccess.signToken(user, session, 'access');
  }
  static createRefreshToken(user, session): string {
    return JwtAccess.signToken(user, session, 'refresh');
  }

  static verifyAccessToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JwtAccess.jwtAccessSecret, (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }
        resolve(decodedToken);
      });
    });
  }

  static createTokensPair(user, session): IJwt  {
    const accessToken = JwtAccess.createAccessToken(user, session);
    const refreshToken = JwtAccess.createRefreshToken(user, session);
    const expiresIn = JwtAccess.accessExpiresIn
      + Number(momentTimezone
        .tz(session.timezone)
        .format('x'));
    return { accessToken, refreshToken, expiresIn } as IJwt;
  }
}
