import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import IJwtResponse from './jwt.response.interface';
import IJwt from './jwt.interface';
dotenv.config();

export const ACCESS_TOKEN_TYPE = 'access';
export const REFRESH_TOKEN_TYPE = 'refresh';

export default abstract class JwtAccess {
  static readonly jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  static readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  private static get getAccessExpires(): number {
    return  Math.floor(Date.now() / 1000) + (2 * 60); // 2 minutes
  }

  private static get getRefreshExpires(): number {
    return  Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60 ); // 15 days
  }

  static signToken(user, session, type) {
    return jwt.sign({
        data: {
          userId: user.id,
          email: user.email,
          sessionId: session.id,
        },
        exp: type === 'access' ?  JwtAccess.getAccessExpires : JwtAccess.getRefreshExpires,
      },
      type === 'access' ?  JwtAccess.jwtAccessSecret : JwtAccess.jwtRefreshSecret,
    );
  }

  static verifyToken(token: string, tokenType: string): Promise<IJwt> {
    return new Promise((resolve, reject) => {
      const clearToken = token.split(' ')[1];
      if (tokenType === ACCESS_TOKEN_TYPE) {
        jwt.verify(clearToken, JwtAccess.jwtAccessSecret, (err, decodedToken) => {
          if (err || !decodedToken) {
            return reject({ err, tokenType: ACCESS_TOKEN_TYPE });
          }
          resolve(decodedToken as IJwt);
        });
      } else {
        jwt.verify(clearToken, JwtAccess.jwtRefreshSecret, (err, decodedToken) => {
          if (err || !decodedToken) {
            return reject({err, tokenType: REFRESH_TOKEN_TYPE});
          }
          resolve(decodedToken as IJwt);
        });
      }
    });
  }

  static createAccessToken(user: User, session: Session): string {
    return JwtAccess.signToken(user, session, ACCESS_TOKEN_TYPE);
  }

  static createRefreshToken(user: User, session: Session): string {
    return JwtAccess.signToken(user, session, REFRESH_TOKEN_TYPE);
  }

  static verifyAccessToken(token: string): Promise<IJwt> {
    return JwtAccess.verifyToken(token, ACCESS_TOKEN_TYPE);
  }

  static verifyRefreshToken(token: string): Promise<IJwt> {
    return JwtAccess.verifyToken(token, REFRESH_TOKEN_TYPE);
  }

  static createTokensPair(user, session): IJwtResponse  {
    const accessToken = JwtAccess.createAccessToken(user, session);
    const expiresIn = JwtAccess.getAccessExpires;
    const refreshToken = JwtAccess.createRefreshToken(user, session);
    return { accessToken, refreshToken, expiresIn };
  }
}
