import RegisterService from './register.service';
import RegisterDTO from './dto/register.dto';
import ConfirmationEmailDTO from './dto/confirmation.email.dto';
import Router from '../../common/abstracts/router';
import validationMiddleware from '../../middlewares/validation.middlewares';
import {CREATED} from 'http-status-codes';

export default class RegisterController extends Router {
  private readonly registerService: RegisterService = new RegisterService();

  constructor() {
    super( '/registration');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post( '/', validationMiddleware(RegisterDTO), async (req, res, next) => {
      try {
        const user = await this.registerService.addUser(req);
        res.status(CREATED).send({user});
      } catch (err) {
        next(err);
      }
    });

    this.router.post('/confirmation/:id', validationMiddleware(ConfirmationEmailDTO), async (req, res, next) => {
      try {
        const user = await this.registerService.confirmUserEmail(req.body, req.params.id);
        res.send({user});
      } catch (err) {
        next(err);
      }
    });
  }

}
