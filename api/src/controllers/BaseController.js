const { getRedis } = require('../config/redis');
class BaseController {
  constructor(model, cacheKey) { this.model = model; this.cacheKey = cacheKey; }
  list = async (req, res) => {
    try {
      const redis = await getRedis();
      const key = this.cacheKey + ':all' + JSON.stringify(req.query);
      if (redis) {
        const cached = await redis.get(key);
        if (cached) return res.json(JSON.parse(cached));
      }
      let where = ''; let params = [];
      if (req.query.featured === 'true') { where = 'WHERE featured=true'; }
      else if (req.query.category_id) { where = 'WHERE category_id=$1'; params = [req.query.category_id]; }
      else if (req.query.search) { where = 'WHERE name ILIKE $1'; params = [`%${req.query.search}%`]; }
      const rows = await this.model.all(where, params);
      if (redis) await redis.setEx(key, 60, JSON.stringify(rows));
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  };
  get = async (req, res) => {
    const row = await this.model.find(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  };
  create = async (req, res) => {
    try {
      const row = await this.model.create(req.body);
      const redis = await getRedis(); if (redis) await redis.del(this.cacheKey + ':all');
      res.status(201).json(row);
    } catch (e) { res.status(400).json({ error: e.message }); }
  };
  update = async (req, res) => {
    try {
      const row = await this.model.update(req.params.id, req.body);
      const redis = await getRedis(); if (redis) await redis.del(this.cacheKey + ':all');
      res.json(row);
    } catch (e) { res.status(400).json({ error: e.message }); }
  };
  remove = async (req, res) => {
    await this.model.remove(req.params.id);
    const redis = await getRedis(); if (redis) await redis.del(this.cacheKey + ':all');
    res.json({ ok: true });
  };
}
module.exports = BaseController;
