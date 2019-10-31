import authMiddleware from '../../middlewares/auth.middleware';
import Router from '../../common/abstracts/router';
import UserService from './user.service';
import HttpException from '../../common/exceptions/HttpException';
import {FORBIDDEN} from 'http-status-codes';

export default class UserController extends Router {
  private userService;
  constructor() {
    super('/user');
    this.userService = new UserService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/:id', [authMiddleware], async (req, res, next) => {
      try {
        const queryUserId = Number(req.params.id);
        if (req.__user__.id !== queryUserId) {
          throw new HttpException('You can not access to this user', FORBIDDEN);
        }
        const data = await this.userService.getUser(queryUserId);
        res.send({ data });
      } catch (err) {
        next(err);
      }
    });
  }

}
