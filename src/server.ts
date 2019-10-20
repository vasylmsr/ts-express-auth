import { createEmailConnection } from './common/mail/mail';
import createTypeormConnection from './common/database/create.connection';
import App from './app';
import getControllers from './modules/index';

async function bootstrap(): Promise<App> {
  await createTypeormConnection();
  await createEmailConnection();
  const app = new App(getControllers());
  if (!module.parent) { app.listen(); }
  return app;
}

bootstrap();
export default bootstrap;
