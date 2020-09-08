import { createEmailConnection } from './common/mail/mail';
import createTypeormConnection from './common/database/create.connection';
import App from './app';
import getControllers from './modules/index';
import { Repository } from 'typeorm';

async function bootstrap(): Promise<App> {
  // @ts-ignore
  Repository.prototype.createAndSave = async function(data) {
    const newObject = await this.create(data);
    return  await this.save(newObject);
  };

  await createTypeormConnection();
  await createEmailConnection();
  const app = new App(getControllers());
  if (!module.parent) { app.listen(); }
  return app;
}

bootstrap();
export default bootstrap;
