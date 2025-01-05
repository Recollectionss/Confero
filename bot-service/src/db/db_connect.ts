import { Sequelize } from 'sequelize-typescript';
import { ENV_CONSTANTS } from '../constants/env_constants';
import { POSTGRES } from '../constants/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const sequelize: Sequelize = new Sequelize({
  host: ENV_CONSTANTS.db.host,
  dialect: POSTGRES,
  port: ENV_CONSTANTS.db.port,
  username: ENV_CONSTANTS.db.username,
  password: String(ENV_CONSTANTS.db.password),
  database: ENV_CONSTANTS.db.database,
  logging: console.log,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to db');
  } catch (error) {
    console.log(`Connection error: ${error}`);
  }
};
