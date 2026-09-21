const { Pool } = require('pg');
require('dotenv').config();
const url = process.env.DATABASE_URL || '';
const isLocalDb = /localhost|127\.0\.0\.1/.test(url);
const hasSslMode = /sslmode=/.test(url);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: hasSslMode ? undefined : (!isLocalDb && process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false),
});

pool.on('connect', () => console.log('Postgres connected'));
pool.on('error', e => console.error('PG error', e.message));
module.exports = pool;
