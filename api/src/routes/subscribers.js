const r = require('express').Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      source TEXT DEFAULT 'landing',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

/** POST /api/subscribers — public newsletter signup */
r.post('/', async (req, res) => {
  try {
    await ensureTable();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const name = req.body?.name?.trim() || null;
    const source = req.body?.source?.trim() || 'landing';
    if (!isEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    const { rows } = await pool.query(
      `INSERT INTO subscribers (email, name, source) VALUES ($1,$2,$3)
       ON CONFLICT (email) DO UPDATE SET name=COALESCE(EXCLUDED.name, subscribers.name)
       RETURNING *`,
      [email, name, source]
    );
    res.status(201).json({ subscribed: true, subscriber: rows[0] });
  } catch (e) {
    console.error('subscribers/subscribe', e);
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/subscribers — admin list (?q= search) */
r.get('/', auth, adminOnly, async (req, res) => {
  try {
    await ensureTable();
    const q = (req.query.q || '').trim();
    const { rows } = await pool.query(
      q
        ? `SELECT * FROM subscribers WHERE email ILIKE $1 ORDER BY created_at DESC`
        : `SELECT * FROM subscribers ORDER BY created_at DESC`,
      q ? [`%${q}%`] : []
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** GET /api/subscribers/export — admin CSV download */
r.get('/export', auth, adminOnly, async (_req, res) => {
  try {
    await ensureTable();
    const { rows } = await pool.query(`SELECT email, name, source, created_at FROM subscribers ORDER BY created_at DESC`);
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = ['email,name,source,subscribed_at', ...rows.map((s) => [esc(s.email), esc(s.name), esc(s.source), esc(s.created_at)].join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="bebold-subscribers.csv"');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** DELETE /api/subscribers/:id — admin remove */
r.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await ensureTable();
    await pool.query(`DELETE FROM subscribers WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = r;
