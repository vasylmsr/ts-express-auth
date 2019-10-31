import RegisterController from './register/register.controller';
import AuthController from './auth/auth.controller';
import UserController from './user/user.controller';
import AppController from './app.controller';

export default () => {
  return [
    new AppController(),
    new RegisterController(),
    new AuthController(),
    new UserController(),
  ];
};
