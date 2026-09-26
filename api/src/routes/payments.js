const r = require('express').Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const { flw, secretKey, encryptionKey, isConfigured } = require('../config/flutterwave');

const requireFlw = (req, res, next) => {
  if (!isConfigured || !flw) return res.status(503).json({ error: 'Payment gateway not configured' });
  next();
};

const isUUID = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v || '');

// Ensure payment columns exist (idempotent, safe to run per-request)
async function ensurePaymentColumns() {
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct'`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tx_ref TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS flw_ref TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ`);
  await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT`);
  // unique index so tx_ref lookups are safe (won't fail if it already exists)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS orders_tx_ref_uidx ON orders (tx_ref)`);
}

const makeTxRef = (prefix = 'BEBOLD') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

// Resolve items -> { lines: [{product_id, qty, price, name}], total }
// Prices are re-read from DB for known product UUIDs to prevent tampering.
async function resolveItems(items) {
  if (!Array.isArray(items) || !items.length) throw new Error('No items');
  const lines = [];
  for (const it of items) {
    const qty = Math.max(1, parseInt(it.qty || it.quantity || 1, 10) || 1);
    const pid = it.product_id || it.id;
    const name = it.name || 'Item';
    let price = Number(it.price) || 0;
    if (pid && isUUID(pid)) {
      const { rows } = await pool.query(`SELECT price, name FROM products WHERE id=$1`, [pid]);
      if (!rows[0]) throw new Error(`Product not found: ${pid}`);
      price = Number(rows[0].price);
      lines.push({ product_id: pid, qty, price, name: rows[0].name });
    } else {
      lines.push({ product_id: null, qty, price, name });
    }
  }
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  if (!(total > 0)) throw new Error('Invalid total');
  return { lines, total };
}

async function createPendingOrder({ userId, email, name, phone, address, lines, total, method, txRef }) {
  const tx_ref = txRef || makeTxRef();
  const { rows } = await pool.query(
    `INSERT INTO orders (user_id,total,address,phone,customer_name,email,source,status,tx_ref,payment_method,payment_status)
     VALUES ($1,$2,$3,$4,$5,$6,'flutterwave','pending',$7,$8,'pending') RETURNING *`,
    [userId || null, total, address || '', phone || '', name || null, email || null, tx_ref, method || null]
  );
  const order = rows[0];
  for (const l of lines) {
    if (l.product_id) {
      try {
        await pool.query(
          `INSERT INTO order_items (order_id,product_id,quantity,price,product_name) VALUES ($1,$2,$3,$4,$5)`,
          [order.id, l.product_id, l.qty, l.price, l.name]
        );
      } catch (e) {
        await pool.query(
          `INSERT INTO order_items (order_id,quantity,price,product_name) VALUES ($1,$2,$3,$4)`,
          [order.id, l.qty, l.price, l.name]
        );
      }
    } else {
      await pool.query(
        `INSERT INTO order_items (order_id,quantity,price,product_name) VALUES ($1,$2,$3,$4)`,
        [order.id, l.qty, l.price, l.name]
      );
    }
  }
  return order;
}

async function markOrderPaid({ tx_ref, flw_ref, payment_method }) {
  const { rows } = await pool.query(
    `UPDATE orders SET status='paid', payment_status='paid', flw_ref=COALESCE($2, flw_ref),
       payment_method=COALESCE($3, payment_method), paid_at=NOW()
     WHERE tx_ref=$1 RETURNING *`,
    [tx_ref, flw_ref || null, payment_method || null]
  );
  return rows[0] || null;
}

// Attach user if a valid Bearer token is present, but don't reject guests.
function optionalAuth(req, _res, next) {
  const h = req.headers.authorization;
  if (h && h.startsWith('Bearer ')) {
    try {
      req.user = require('../utils/jwt').verify(h.split(' ')[1]);
    } catch { /* guest */ }
  }
  next();
}

/**
 * POST /api/payments/initialize
 * Hosted checkout (Flutterwave Standard) — supports Cards + Bank Transfer
 * in one link. Body: { email*, name, phone, address, currency?, items? }
 * If logged in and no items supplied, uses server cart.
 */
r.post('/initialize', optionalAuth, requireFlw, async (req, res) => {
  try {
    await ensurePaymentColumns();
    let { email, name, fullname, phone, phone_number, address, currency = 'NGN', items, payment_method } = req.body || {};
    email = email || req.user?.email;
    name = name || fullname || req.user?.name || 'Customer';
    phone = phone || phone_number || '';
    if (!email) return res.status(400).json({ error: 'email is required' });

    // Default to server-side cart for logged-in users when items not supplied
    if ((!items || !items.length) && req.user?.id) {
      const cart = await pool.query(
        `SELECT c.product_id, c.quantity, p.price, p.name FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=$1`,
        [req.user.id]
      );
      if (cart.rows.length) {
        items = cart.rows.map((c) => ({ product_id: c.product_id, qty: c.quantity, price: c.price, name: c.name }));
      }
    }
    const { lines, total } = await resolveItems(items);
    const order = await createPendingOrder({
      userId: req.user?.id, email, name, phone, address, lines, total,
      method: payment_method || 'hosted', txRef: makeTxRef(),
    });

    const redirect_url =
      process.env.FLW_REDIRECT_URL || `${(process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '')}/payment-callback`;

    const fwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_ref: order.tx_ref,
        amount: Number(order.total),
        currency,
        redirect_url,
        customer: { email, name, phonenumber: phone },
        customizations: { title: 'Be Bold', description: `Order ${order.id}` },
        meta: { order_id: order.id },
      }),
    });
    const fwData = await fwRes.json().catch(() => ({}));
    if (!fwRes.ok || fwData.status !== 'success' || !fwData.data?.link) {
      await pool.query(`UPDATE orders SET payment_status='init_failed' WHERE id=$1`, [order.id]);
      return res.status(502).json({ error: fwData.message || 'Failed to create payment link', details: fwData });
    }
    res.status(201).json({ order, tx_ref: order.tx_ref, payment_link: fwData.data.link });
  } catch (e) {
    console.error('payments/initialize', e);
    res.status(400).json({ error: e.message });
  }
});

/**
 * POST /api/payments/bank-transfer  (direct charge, per docs)
 * Body: { email*, phone_number, order_id? | (items + name/address/phone), currency?, narration? }
 * Returns transfer account details the customer should pay into.
 */
r.post('/bank-transfer', optionalAuth, requireFlw, async (req, res) => {
  try {
    await ensurePaymentColumns();
    const { email, phone_number, phone, order_id, items, currency = 'NGN', narration, expires = 3600 } = req.body || {};
    let order = null;
    let amount;
    if (order_id) {
      const { rows } = await pool.query(`SELECT * FROM orders WHERE id=$1`, [order_id]);
      if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
      order = rows[0];
      if (order.status === 'paid') return res.status(400).json({ error: 'Order already paid' });
      amount = Number(order.total);
    } else {
      if (!email) return res.status(400).json({ error: 'email is required' });
      const resolved = await resolveItems(items);
      amount = resolved.total;
      const b = req.body || {};
      order = await createPendingOrder({
        userId: req.user?.id, email, name: b.name || b.fullname || 'Customer',
        phone: b.phone || phone || phone_number || '', address: b.address || '',
        lines: resolved.lines, total: resolved.total, method: 'bank_transfer',
      });
    }
    const payload = {
      tx_ref: order.tx_ref,
      amount: String(amount),
      email: email || order.email,
      phone_number: phone_number || phone || order.phone || '',
      currency,
      narration: narration || `Be Bold order ${order.id}`,
      expires,
    };
    const resOrigin = await fetch('https://api.flutterwave.com/v3/charges?type=bank_transfer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((x) => x.json());
    // Also works via SDK: await flw.Charge.bank_transfer(payload)
    const authz = resOrigin.meta?.authorization || resOrigin.data?.meta?.authorization;
    res.json({
      order, tx_ref: order.tx_ref,
      transfer: authz ? {
        account_number: authz.transfer_account,
        bank: authz.transfer_bank,
        amount: authz.transfer_amount,
        reference: authz.transfer_reference,
        note: authz.transfer_note,
        expires_at: authz.account_expiration,
      } : null,
      raw: resOrigin,
    });
  } catch (e) {
    console.error('payments/bank-transfer', e?.response?.data || e);
    res.status(400).json({ error: e?.response?.data?.message || e.message });
  }
});

/**
 * POST /api/payments/card  (direct card charge, per docs)
 * Body: { card_number, cvv, expiry_month, expiry_year, email*, fullname*, phone_number?,
 *         order_id? | items, currency?, redirect_url?, pin?, authorization? }
 * Handles pin-mode by accepting `pin` directly; 3DS/redirect returns redirect URL.
 */
r.post('/card', optionalAuth, requireFlw, async (req, res) => {
  try {
    await ensurePaymentColumns();
    const b = req.body || {};
    if (!encryptionKey) return res.status(503).json({ error: 'Card encryption key (FLW_KEY_ENCRYPTION) not configured' });
    const { card_number, cvv, expiry_month, expiry_year, currency = 'NGN', order_id, items, pin, authorization } = b;
    if (!card_number || !cvv || !expiry_month || !expiry_year) {
      return res.status(400).json({ error: 'card_number, cvv, expiry_month, expiry_year are required' });
    }
    let order = null;
    let amount;
    if (order_id) {
      const { rows } = await pool.query(`SELECT * FROM orders WHERE id=$1`, [order_id]);
      if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
      order = rows[0];
      if (order.status === 'paid') return res.status(400).json({ error: 'Order already paid' });
      amount = Number(order.total);
    } else {
      if (!b.email) return res.status(400).json({ error: 'email is required' });
      const resolved = await resolveItems(items);
      amount = resolved.total;
      order = await createPendingOrder({
        userId: req.user?.id, email: b.email, name: b.fullname || b.name || 'Customer',
        phone: b.phone_number || b.phone || '', address: b.address || '',
        lines: resolved.lines, total: resolved.total, method: 'card',
      });
    }
    const payload = {
      card_number, cvv, expiry_month, expiry_year,
      currency,
      amount: String(amount),
      email: b.email || order.email,
      fullname: b.fullname || b.name || order.customer_name || 'Customer',
      phone_number: b.phone_number || b.phone || order.phone || '',
      tx_ref: order.tx_ref,
      redirect_url: b.redirect_url || process.env.FLW_REDIRECT_URL || `${(process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '')}/payment-callback`,
      enckey: encryptionKey,
    };
    if (pin) payload.authorization = { mode: 'pin', fields: ['pin'], pin };
    if (authorization) payload.authorization = authorization;

    const response = await flw.Charge.card(payload);
    const mode = response?.meta?.authorization?.mode;
    if (mode === 'redirect') {
      return res.json({ order, tx_ref: order.tx_ref, mode, redirect: response.meta.authorization.redirect, raw: response });
    }
    // pin/otp/avs flows return next-step instructions; frontend should call /card/validate with OTP
    res.json({
      order, tx_ref: order.tx_ref, mode: mode || null,
      flw_ref: response?.data?.flw_ref || null,
      message: response?.message, raw: response,
    });
  } catch (e) {
    console.error('payments/card', e?.response?.data || e);
    res.status(400).json({ error: e?.response?.data?.message || e.message });
  }
});

/** POST /api/payments/card/validate  { otp*, flw_ref*, tx_ref? } */
r.post('/card/validate', requireFlw, async (req, res) => {
  try {
    await ensurePaymentColumns();
    const { otp, flw_ref, tx_ref } = req.body || {};
    if (!otp || !flw_ref) return res.status(400).json({ error: 'otp and flw_ref are required' });
    const response = await flw.Charge.validate({ otp, flw_ref });
    const txRef = tx_ref || response?.data?.tx_ref;
    if (response?.status === 'success' && txRef) {
      const order = await markOrderPaid({ tx_ref: txRef, flw_ref, payment_method: 'card' });
      return res.json({ verified: true, order, raw: response });
    }
    res.json({ verified: false, raw: response });
  } catch (e) {
    console.error('payments/card/validate', e?.response?.data || e);
    res.status(400).json({ error: e?.response?.data?.message || e.message });
  }
});

/**
 * GET /api/payments/verify/:tx_ref?transaction_id=xxx
 * Verifies with Flutterwave and marks the order paid on success.
 */
r.get('/verify/:tx_ref', requireFlw, async (req, res) => {
  try {
    await ensurePaymentColumns();
    const { tx_ref } = req.params;
    const { transaction_id } = req.query;
    let response;
    if (transaction_id) {
      response = await flw.Transaction.verify({ id: Number(transaction_id) });
    } else {
      response = await flw.Transaction.verify_by_tx({ tx_ref });
    }
    const data = response?.data;
    const ok = response?.status === 'success' && data?.status === 'successful';
    if (!ok) return res.json({ verified: false, raw: response });
    // Confirm the paid tx_ref matches (verify_by_tx) or look up order safely
    const paidRef = data?.tx_ref || tx_ref;
    const order = await markOrderPaid({ tx_ref: paidRef, flw_ref: data?.flw_ref, payment_method: data?.payment_type || data?.narration || undefined });
    // Clear buyer's server cart once paid
    if (order?.user_id) await pool.query(`DELETE FROM cart_items WHERE user_id=$1`, [order.user_id]);
    res.json({ verified: true, order, raw: response });
  } catch (e) {
    console.error('payments/verify', e?.response?.data || e);
    res.status(400).json({ error: e?.response?.data?.message || e.message });
  }
});

/**
 * POST /api/payments/webhook  — set this URL in the Flutterwave dashboard.
 * Flutterwave sends `verif-hash` header; it must equal your secret key.
 */
r.post('/webhook', async (req, res) => {
  try {
    await ensurePaymentColumns();
    const signature = req.headers['verif-hash'];
    if (!secretKey || signature !== secretKey) return res.status(401).json({ error: 'Invalid signature' });
    const { event, data } = req.body || {};
    if (event === 'charge.completed' && data?.status === 'successful' && data?.tx_ref) {
      await markOrderPaid({ tx_ref: data.tx_ref, flw_ref: data.flw_ref, payment_method: data.payment_type });
    }
    res.json({ received: true });
  } catch (e) {
    console.error('payments/webhook', e);
    res.status(500).json({ error: e.message });
  }
});

/** Public: runtime feature flags for the storefront (no restart/rebuild needed) */
r.get('/config', async (_req, res) => {
  res.json({
    enablePayment: process.env.ENABLE_PAYMENT === 'true',
    currency: process.env.PAYMENT_CURRENCY || 'NGN',
  });
});

/** Authenticated: list my flutterwave orders */
r.get('/my', auth, async (req, res) => {
  await ensurePaymentColumns();
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE user_id=$1 AND source='flutterwave' ORDER BY created_at DESC`, [req.user.id]
  );
  res.json(rows);
});

module.exports = r;
