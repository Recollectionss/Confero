// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

module.exports = {
  username: 'root',
  password: 'toor',
  database: process.env.POSTGRES_DB || 'confero',
  host: process.env.POSTGRES_HOST || 'localhost',
  dialect: 'postgres',
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
// require('dotenv').config();
//
// module.exports = {
//   username: process.env.POSTGRES_USER,
//   password: String(process.env.POSTGRES_PASSWORD),
//   database: process.env.POSTGRES_DB,
//   host: process.env.POSTGRES_HOST,
//   dialect: 'postgres',
// };
