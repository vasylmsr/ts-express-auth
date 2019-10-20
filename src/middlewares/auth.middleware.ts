import JwtAccess from '../common/jwt/jwt.static';
import HttpException from '../common/exceptions/HttpException';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes';
import User from '../entities/user.entity';
import UserService from '../modules/user/user.service';

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
    const userService = new UserService();
    const dataFromToken = await JwtAccess.verifyAccessToken(request.headers.authorization);
    const user =  await userService.getUser(dataFromToken.data.userId);
    if (!user) { throw new HttpException('', UNAUTHORIZED); }
    return user;
  } catch (e) {
    throw new HttpException(e.name, UNAUTHORIZED);
  }
}
export default authMiddleware;
