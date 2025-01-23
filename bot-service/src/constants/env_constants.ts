import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();
export const ENV_CONSTANTS = {
  // discord-bot
  discord: {
    token: String(process.env.DISCORD_TOKEN),
    pollChannel: String(process.env.POLL_CHANNEL),
    commandChannel: String(process.env.COMMAND_CHANNEL),
  },
  //postgres
  db: {
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_APP_USER_NAME,
    password: String(process.env.POSTGRES_APP_USER_PASSWORD),
    host: Number(process.env.POSTGRES_HOST),
    database: process.env.POSTGRES_DB,
  },
  //smtp
  smtp: {
    user: process.env.SMTP_USERNAME,
    pass: String(process.env.SMTP_PASSWORD),
    host: String(process.env.SMTP_HOST),
    port: Number(process.env.SMTP_PORT),
  },
};
