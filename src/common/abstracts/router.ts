import * as express from 'express';

export default abstract class Router {
  public router: express.Router = express.Router();
  public path: string;
  abstract initializeRoutes(): void;

  protected constructor(path: string) {
    this.path = path;
  }
}
