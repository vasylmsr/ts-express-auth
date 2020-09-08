import {ConnectionOptions, createConnection } from 'typeorm';
import ormconfig from './ormconfig';
import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;
const createTypeormConnection = async () => {
  const config = env.NODE_ENV === 'test' ? ormconfig[1] : ormconfig[0];
  return createConnection(config as ConnectionOptions);
};

export default createTypeormConnection;
