import RegisterService from './register.service';
import RegisterDTO from './dto/register.dto';
import ConfirmationEmailDTO from './dto/сonfirmation.email.dto';
import Router from '../../common/abstracts/router';
import validationMiddleware from '../../middlewares/validation.middlewares';

export default class RegisterController extends Router {
  private readonly authService: RegisterService = new RegisterService();

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {

    this.router.post( '/', validationMiddleware(RegisterDTO), async (req, res, next) => {
      try {
        const response = await this.authService.addUser(req);
        res.send(response);
      } catch (err) {
        next(err);
      }

    });

    this.router.post('/confirmation/:id', validationMiddleware(ConfirmationEmailDTO), async (req, res, next) => {
      try {
        const response = await this.authService.confirmUserEmail(req.body, req.params.id);
        res.send(response);
      } catch (err) {
        next(err);
      }
    });
  }

}
