import { createConnection, Connection } from "typeorm";
import ormconfig from './ormconfig';
import App from './app';
import controllers from './handlers/index';

async function bootstrap() {
	try {
		await createConnection(ormconfig);
		const app = new App(controllers, 5000);
		app.listen();
	}
	catch(err) {
		console.log("Error: DB connection");
		return err;
	}
}

bootstrap();