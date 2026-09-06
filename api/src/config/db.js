const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('connect', () => console.log('Postgres connected'));
pool.on('error', e => console.error('PG error', e.message));
module.exports = pool;
