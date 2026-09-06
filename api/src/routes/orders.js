const r=require('express').Router();
const pool=require('../config/db');
const { auth, adminOnly }=require('../middleware/auth');
r.post('/', auth, async(req,res)=>{
  const { address, phone }=req.body;
  const cart = await pool.query(`SELECT c.product_id, c.quantity, p.price FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=$1`,[req.user.id]);
  if(!cart.rows.length) return res.status(400).json({error:'Cart empty'});
  const total = cart.rows.reduce((s,i)=> s + Number(i.price)*i.quantity,0);
  const order = await pool.query(`INSERT INTO orders (user_id,total,address,phone,status) VALUES ($1,$2,$3,$4,'pending') RETURNING *`,[req.user.id,total,address,phone]);
  const oid=order.rows[0].id;
  for(const it of cart.rows){
    await pool.query(`INSERT INTO order_items (order_id,product_id,quantity,price) VALUES ($1,$2,$3,$4)`,[oid,it.product_id,it.quantity,it.price]);
  }
  await pool.query(`DELETE FROM cart_items WHERE user_id=$1`,[req.user.id]);
  res.status(201).json(order.rows[0]);
});
r.get('/my', auth, async(req,res)=>{
  const { rows } = await pool.query(`SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC`,[req.user.id]);
  res.json(rows);
});
r.post('/whatsapp', async(req,res)=>{
  try{
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT`);
    await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct'`);
    await pool.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT`);
    const { name, phone, address, items } = req.body;
    if(!items || !Array.isArray(items) || !items.length) return res.status(400).json({error:'No items'});
    const total = items.reduce((s,i)=> s + Number(i.price||0)*Number(i.qty||i.quantity||1),0);
    const addr = address || '';
    const cname = name || null;
    const src = 'whatsapp';
    const order = await pool.query(`INSERT INTO orders (user_id,total,address,phone,customer_name,source,status) VALUES (NULL,$1,$2,$3,$4,$5,'pending') RETURNING *`,[total,addr,phone,cname,src]);
    const oid=order.rows[0].id;
    for(const it of items){
      const qty=Math.max(1,parseInt(it.qty||it.quantity||1)||1);
      const price=Number(it.price)||0;
      const pname=it.name||'Unknown';
      const isUUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(it.id||it.product_id||'');
      const pid=isUUID ? (it.id||it.product_id) : null;
      if(pid){
        try{ await pool.query(`INSERT INTO order_items (order_id,product_id,quantity,price,product_name) VALUES ($1,$2,$3,$4,$5)`,[oid,pid,qty,price,pname]); }
        catch(e){ await pool.query(`INSERT INTO order_items (order_id,quantity,price,product_name) VALUES ($1,$2,$3,$4)`,[oid,qty,price,pname]); }
      } else {
        await pool.query(`INSERT INTO order_items (order_id,quantity,price,product_name) VALUES ($1,$2,$3,$4)`,[oid,qty,price,pname]);
      }
    }
    res.status(201).json(order.rows[0]);
  }catch(e){ console.error('whatsapp order',e); res.status(500).json({error:e.message}); }
});
r.get('/', auth, adminOnly, async(req,res)=>{
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT`);
  await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct'`);
  const { rows } = await pool.query(`SELECT o.*, u.name as user_name, u.email FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC`);
  res.json(rows);
});
r.get('/:id', auth, async(req,res)=>{
  const o = await pool.query(`SELECT * FROM orders WHERE id=$1`,[req.params.id]);
  if(!o.rows[0]) return res.status(404).json({error:'Not found'});
  if(req.user.role!=='admin' && o.rows[0].user_id!==req.user.id) return res.status(403).json({error:'Forbidden'});
  const items = await pool.query(`SELECT oi.*, COALESCE(p.name, oi.product_name) as name, p.image FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=$1`,[req.params.id]);
  res.json({ ...o.rows[0], items: items.rows });
});
r.put('/:id/status', auth, adminOnly, async(req,res)=>{
  const { rows } = await pool.query(`UPDATE orders SET status=$1 WHERE id=$2 RETURNING *`,[req.body.status,req.params.id]);
  res.json(rows[0]);
});
module.exports=r;
