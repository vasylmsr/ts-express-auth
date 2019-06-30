import * as express from 'express';
import AuthService from './auth.service';

export default class AuthController {
	public router = express.Router();
	private readonly authService: AuthService = new AuthService();

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.get('/registration', async (req, res) => {
			await res.send(this.authService.addUser('Hello, world'));
		});
	}
}