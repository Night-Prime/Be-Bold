const r=require('express').Router();
const pool=require('../config/db');
const { auth }=require('../middleware/auth');
const isUUID=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
r.get('/', auth, async(req,res)=>{
  try{
    const { rows } = await pool.query(`SELECT c.id, c.quantity, p.* FROM cart_items c JOIN products p ON p.id=c.product_id WHERE c.user_id=$1`,[req.user.id]);
    res.json(rows);
  }catch(e){ res.status(500).json({error:e.message}); }
});
r.post('/', auth, async(req,res)=>{
  try{
    const { product_id, quantity=1 }=req.body;
    if(!product_id) return res.status(400).json({error:'product_id required'});
    if(!isUUID(product_id)) return res.status(400).json({error:'Invalid product_id - expected UUID. Add products via /api/products not fallback data.'});
    const qty=Math.max(1,parseInt(quantity)||1);
    const { rows } = await pool.query(`INSERT INTO cart_items (user_id,product_id,quantity) VALUES ($1,$2,$3) ON CONFLICT (user_id,product_id) DO UPDATE SET quantity=cart_items.quantity+EXCLUDED.quantity RETURNING *`,[req.user.id,product_id,qty]);
    res.json(rows[0]);
  }catch(e){
    if(e.code==='22P02') return res.status(400).json({error:'Invalid product_id format'});
    if(e.code==='23503') return res.status(400).json({error:'Product not found'});
    res.status(500).json({error:e.message});
  }
});
r.put('/:id', auth, async(req,res)=>{
  try{
    if(!isUUID(req.params.id)) return res.status(400).json({error:'Invalid id'});
    const { quantity }=req.body;
    const qty=Math.max(1,parseInt(quantity)||1);
    const { rows } = await pool.query(`UPDATE cart_items SET quantity=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,[qty,req.params.id,req.user.id]);
    if(!rows[0]) return res.status(404).json({error:'Not found'});
    res.json(rows[0]);
  }catch(e){ res.status(500).json({error:e.message}); }
});
r.delete('/:id', auth, async(req,res)=>{
  try{
    if(!isUUID(req.params.id)) return res.status(400).json({error:'Invalid id'});
    await pool.query(`DELETE FROM cart_items WHERE id=$1 AND user_id=$2`,[req.params.id,req.user.id]);
    res.json({ok:true});
  }catch(e){ res.status(500).json({error:e.message}); }
});
r.delete('/', auth, async(req,res)=>{
  try{
    await pool.query(`DELETE FROM cart_items WHERE user_id=$1`,[req.user.id]);
    res.json({ok:true});
  }catch(e){ res.status(500).json({error:e.message}); }
});
module.exports=r;
