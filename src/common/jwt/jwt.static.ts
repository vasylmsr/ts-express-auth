import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import User from '../../entities/user.entity';
import Session from '../../entities/session.entity';
import IJwtResponse from './jwt.response.interface';
import IJwt from './jwt.interface';
dotenv.config();

export default abstract class JwtAccess {
  static readonly jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  static readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  private static get getAccessExpires(): number {
    return  Math.floor(Date.now() / 1000) + (2 * 60); // 2 minutes
  }

  private static get getRefreshExpires(): number {
    return  Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 15 days
  }

  static signToken(data: object, secretKey: string, options?: object): string {
    return jwt.sign({ data }, secretKey, options );
  }

  static verifyToken(token: string, secretKey: string): Promise<IJwt> {
    return new Promise((resolve, reject) => {
      const clearToken = token.split(' ')[1];
      jwt.verify(clearToken, secretKey, (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }
        resolve(decodedToken as IJwt);
      });
    });
  }

  static createAccessToken(user: User, session: Session): string {
    return JwtAccess.signToken( {
        data: JwtAccess.setDataForUserToken(user, session),
        exp: JwtAccess.getAccessExpires,
      },
      JwtAccess.jwtAccessSecret);
  }

  static createRefreshToken(user: User, session: Session): string {
    return JwtAccess.signToken( {
        data: JwtAccess.setDataForUserToken(user, session),
        exp: JwtAccess.getRefreshExpires,
      },
      JwtAccess.jwtRefreshSecret);
  }

  static async verifyAccessToken(token: string): Promise<IJwt> {
    return await JwtAccess.verifyToken(token, JwtAccess.jwtAccessSecret);
  }

  static setDataForUserToken(user: User, session: Session) {
    return {
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    };
  }

  static async verifyRefreshToken(token: string): Promise<IJwt> {
    return await JwtAccess.verifyToken(token, JwtAccess.jwtRefreshSecret);
  }

  static createTokensPair(user, session): IJwtResponse  {
    const accessToken = JwtAccess.createAccessToken(user, session);
    const refreshToken = JwtAccess.createRefreshToken(user, session);
    const expiresIn = JwtAccess.getAccessExpires;
    return { accessToken, refreshToken, expiresIn };
  }
}
