import Router from '../../common/abstracts/router';
import validationMiddleware from '../../middlewares/validation.middlewares';
import LoginDTO from './dto/login.dto';
import AuthService from './auth.service';
import * as passport from 'passport';

export default class AuthController extends Router {
  private authService;

  constructor() {
    super('/auth');
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/sign_in', validationMiddleware(LoginDTO), async (req, res, next) => {
      try {
        const user = await this.authService.signIn(req.body, req.headers, req.connection);
        res.send({ user });
      } catch (err) {
        next(err);
      }
    });

    this.router.get('/sign_in/google', passport.authenticate('google', {
      session: false,
      scope: 'email profile',
      prompt: 'consent', // ask user confirmation every time
    }));
    // Користувач переходить на сторінку /sign_in/google і за допомогою паспорт відбувається редірект на
    // сторінку гугл авторизації, якщо юзер успішно дав нам права, то гугл повертає юзера на callback
    // сторінку /sign_in/google/callback і передає у параметри код. За допомогою цього коду ми отримуємо
    // токен, а за допомогою токена потім юзера
    this.router.get('/sign_in/google/callback', passport.authenticate('google', {
      session: false,
    }), async (req, res, next) => {
      try {
        // @ts-ignore
        const user = await this.authService.signInViaSocial(req.user, req.headers, req.connection);
        res.send({ user });
      } catch (err) {
        next(err);
      }
    });

    this.router.post('/sign_out', async (req, res, next) => {
      try {
        const data = await this.authService.signOut(req.headers.authorization);
        res.send({ data });
      } catch (err) {
        next(err);
      }
    });

    this.router.get('/refresh_token', async (req, res, next) => {
      try {
        const data = await this.authService.updateTokens(req.headers.authorization);
        res.send({ data });
      } catch (err) {
        next(err);
      }
    });

  }

}
