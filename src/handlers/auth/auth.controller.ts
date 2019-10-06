import * as express from 'express';
import AuthService from './auth.service';
import RegisterDTO from './dto/register.dto';
import ConfirmationEmailDTO from './dto/сonfirmation.email.dto';
import LoginDTO from './dto/login.dto';
import validationMiddleware from '../../middlewares/validation.middlewares';

export default class AuthController {
	public router = express.Router();
	private readonly authService: AuthService = new AuthService();
	private prefix;

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {

		this.router.post('/registration', validationMiddleware(RegisterDTO), async (req, res) => {
			const response = await this.authService.addUser(req.body);
			res.send(response);
		});

		this.router.post('/registration/confirmation/:id', validationMiddleware(ConfirmationEmailDTO), async (req, res) => {
			const response = await this.authService.confirmUserEmail(req.body, req.params.id);
			res.send(response);
		});

		this.router.post('/login', validationMiddleware(LoginDTO), (req, res, next) => {

		});
	}

}
