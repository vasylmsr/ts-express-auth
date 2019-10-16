import JwtAccess from '../common/jwt/jwt.static';
import HttpException from '../common/exceptions/HttpException';
import {FORBIDDEN, UNAUTHORIZED} from 'http-status-codes';
import User from '../entities/user.entity';
import IJwt from '../common/jwt/jwt.interface';
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
    const user = await getUser(request) as User;
    if (!user.confirmation.isEmailConfirmed) {
      next(new HttpException('You must confirm your email', FORBIDDEN));
    }
    request.__user__ = user;
    next();
  } catch (e) {
    next(e);
  }
}
async function getUser(request): Promise< User | HttpException > {
  try {
    const userService = new UserService();
    const dataFromToken = await JwtAccess.verifyAccessToken(request.headers.authorization) as IJwt;
    const user =  await userService.getUser(dataFromToken.data.userId);
    if (!user) { return new HttpException('', UNAUTHORIZED); }
    return user;
  } catch (e) {
    return new HttpException(e.err.name, UNAUTHORIZED);
  }
}
export default authMiddleware;
