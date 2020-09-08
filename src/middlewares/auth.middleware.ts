import JwtAccess from '../common/jwt/jwt.static';
import HttpException from '../common/exceptions/HttpException';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes';
import User from '../entities/user.entity';
import AuthService from '../modules/auth/auth.service';

async function authMiddleware(request, response, next) {
  try {
    const user = await getUser(request);
    request.__user__ = user;
    next();
  } catch (e) {
    next(e);
  }
}

async function authAndConfirmedMiddleware(request, response, next) {
  try {
    const user = await getUser(request);
    if (!user.confirmation.isEmailConfirmed) {
      next(new HttpException('You must confirm your email', FORBIDDEN));
    }
    request.__user__ = user;
    next();
  } catch (e) {
    next(e);
  }
}
async function getUser(request): Promise<User> {
  try {
    const authService = new AuthService();
    const { user, session } = await authService
      .getUserAndSessionFromToken(request.headers.authorization, JwtAccess.verifyAccessToken);
    if (!user || !session || !session.isActive) {
      throw new HttpException('', UNAUTHORIZED);
    }
    return user;
  } catch (e) {
    throw e;
  }
}
export default authMiddleware;
