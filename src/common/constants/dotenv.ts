import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

export const FRONT_URL: string = env.FRONT_URL;
export const PORT: number = Number(env.PORT);
