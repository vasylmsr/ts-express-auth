import {ConnectionOptions, createConnection, createConnections, getConnectionOptions} from 'typeorm';
import ormconfig from './ormconfig';
const createTypeormConnection = async () => {
  return createConnection(ormconfig as ConnectionOptions);
};

export default createTypeormConnection;
