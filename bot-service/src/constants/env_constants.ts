export const ENV_CONSTANTS = {
  //   postgres
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'toor',
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB || 'confero',
};
