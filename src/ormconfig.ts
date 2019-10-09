import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

const config: ConnectionOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  port: Number(env.DB_PORT),
  entities: [ './src/entities/*.entity{.ts,.js}' ],
  synchronize: true,
};

export default config;
