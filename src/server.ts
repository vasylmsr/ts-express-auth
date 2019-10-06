import { createConnection } from 'typeorm';
import { createEmailConnection } from './common/mail/mail';
import ormconfig from './ormconfig';
import App from './app';
import getControllers from './handlers/index';

async function bootstrap() {
	try {
		await createConnection(ormconfig);
		await createEmailConnection();
		const app = new App(getControllers(), 5000);
		app.listen();
	} catch (err) {

		console.log(1111)

		if (err.message) {
			console.log(err.message);
		} else { console.log(err); }
		return err;
	}
}

bootstrap();
