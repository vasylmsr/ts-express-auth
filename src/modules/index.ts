import RegisterController from './register/register.controller';
import AuthController from './auth/auth.controller';

export default () => {
	return {
		'/registration': new RegisterController(),
		'/auth': new AuthController(),
	};
};
