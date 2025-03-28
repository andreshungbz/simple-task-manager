// Filename: database.ts
// configuration of the PostgreSQL client and connection pool

import pg from 'pg';
import dotenv from 'dotenv';

import { config } from './app.config.js';

dotenv.config();

// create the connection pool
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// test the connection
pool.connect((err, _client, release) => {
  if (err) {
    return console.error(
      `[${config.abbreviation}] Error Acquiring Database Client`,
      err.stack
    );
  }

  console.log(`[${config.abbreviation}] Connected to PostgreSQL Database`);
  release();
});

// check for errors
pool.on('error', (err) => {
  console.error(
    `[${config.abbreviation}] Unexpected Database Client Error`,
    err
  );
  process.exit(-1);
});

// use a function wrapper to make queries
export const query = async (
  text: string,
  params?: Array<string | number | null>
): Promise<pg.QueryResult<any>> => {
  return await pool.query({
    text,
    values: params,
  });
};

export default pool;
