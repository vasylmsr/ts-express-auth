import * as express from 'express';
import * as bodyParser from 'body-parser';
import { PORT } from './common/constants/dotenv';
import errorMiddleware from './middlewares/error.middleware';
enum ConsoleColors {
  Green = '\x1b[32m',
}

export default class App {
  public app: express.Application;
  public port: number;
  constructor(controllers) {
    this.app = express();
    this.port = PORT || 5000;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use((req, res, next) => {
      // res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  private initializeControllers(controllers) {
    Object.entries(controllers).forEach(([k, v]) => {
      // @ts-ignore
      this.app.use(k, v.router);
    });

  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    return this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(ConsoleColors.Green, `App is started on ${this.port} port`);
    });
  }
}

