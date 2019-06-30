import * as express from 'express';
import * as bodyParser from 'body-parser';
enum ConsoleColors {
	Green = "\x1b[32m"
}

export default class App {
	public app: express.Application;
	public port: number;

	constructor(controllers, port) {
		this.app = express();
		this.port = port;
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	private initializeMiddlewares() {
		this.app.use(bodyParser.json());
		this.app.use(function(req, res, next) {
		  res.header('Access-Control-Allow-Credentials', true);
		  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		  next();
		});
	}

	private initializeControllers(controllers) {
		controllers.forEach(controller => {
			this.app.use('/', controller.router);
		})
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(ConsoleColors.Green, `App is started on ${this.port} port`);
		})
	}
}


