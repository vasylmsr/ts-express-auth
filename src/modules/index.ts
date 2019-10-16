import RegisterController from './register/register.controller';
import AuthController from './auth/auth.controller';
import UserController from './user/user.controller';

export default () => {
  return {
    '/registration': new RegisterController(),
    '/auth': new AuthController(),
    '/user': new UserController(),
  };
};
