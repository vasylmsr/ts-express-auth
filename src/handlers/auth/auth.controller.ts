import * as express from 'express';
import AuthService from './auth.service';

export default class AuthController {
	public router = express.Router();
	private readonly authService: AuthService = new AuthService();

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post('/registration', async (req, res, next) => {
			try {
				const response = await this.authService.addUser(req.body);
				res.send(response);
			} catch (err) {
				next(err);
			}
		});
	}

}
