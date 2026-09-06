const { createClient } = require('redis');
require('dotenv').config();
let client;
async function getRedis() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  client.on('error', e => console.error('Redis', e.message));
  try { await client.connect(); console.log('Redis connected'); } catch { console.log('Redis unavailable - caching disabled'); client = null; }
  return client;
}
module.exports = { getRedis };
