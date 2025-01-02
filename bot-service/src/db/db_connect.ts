import { Sequelize } from 'sequelize-typescript';
import { ENV_CONSTANTS } from '../constants/env_constants';
import { POSTGRES } from '../constants/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const sequelize: Sequelize = new Sequelize({
  host: ENV_CONSTANTS.host,
  dialect: POSTGRES,
  port: ENV_CONSTANTS.port,
  username: ENV_CONSTANTS.username,
  password: String(ENV_CONSTANTS.password),
  database: ENV_CONSTANTS.database,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to db');
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};
