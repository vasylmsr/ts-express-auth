import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

const baseConnection = {
  type: 'postgres',
  host: env.DB_HOST,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  port: Number(env.DB_PORT),
  entities: [ 'src/entities/*.entity{.ts,.js}' ],
  migrationsTableName: 'migrations',
  migrations: ['src/common/database/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/common/database/migrations',
  },
};

export default [
  {
    ...baseConnection,
    database: env.DB_DATABASE,
    synchronize: false,
  },
  {
    ...baseConnection,
    database: env.DB_DATABASE_TEST,
    synchronize: true,
  },
];
