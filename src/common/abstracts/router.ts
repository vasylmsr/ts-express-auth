import * as express from 'express';

export default abstract class Router {
  public router: express.Router = express.Router();
  abstract initializeRoutes(): void;
}
