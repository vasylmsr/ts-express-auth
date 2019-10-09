import Router from '../../common/abstracts/router';
import validationMiddleware from '../../middlewares/validation.middlewares';
import LoginDTO from './dto/login.dto';
import AuthService from './auth.service';

export default class AuthController extends Router {
	private authService;

	constructor() {
		super();
		this.authService = new AuthService();
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post('/signIn', validationMiddleware(LoginDTO), async (req, res, next) => {
			try {
				const a = await this.authService.signIn(req.body, req.headers, req.connection);
				res.send({ a });
			} catch (err) {
				next(err);
			}
		});

		// this.router.post('/signOut')

		// this.router.post('/user')
		// this.router.get('/updateToken')

	}

}
