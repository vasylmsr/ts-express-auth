import * as express from 'express';
import AuthService from './auth.service';

export default class AuthController {
	public router = express.Router();
	private readonly authService: AuthService = new AuthService();

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.post('/registration', async (req, res) => {
			try {
				const response = this.authService.addUser(req.body);
				res.send(response);
			}
			catch(err) {
				if(err.name === "HttpException") {
					res.status(400).send(err.message);
				}
			}
		});
	}
}