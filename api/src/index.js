require('dotenv').config();
const express=require('express');
const cors=require('cors');
const pool=require('./config/db');
const app=express();
app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.get('/health', (req,res)=>res.json({ok:true, time:new Date().toISOString()}));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));
app.get('/api/search', async(req,res)=>{
  try{
    const q=req.query.q||'';
    const { rows }=await pool.query(`SELECT p.*, c.name as category FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.name ILIKE $1 OR p.description ILIKE $1`,[`%${q}%`]);
    res.json(rows);
  }catch(e){ res.status(500).json({error:e.message});}
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.use((err,req,res,next)=>{ console.error(err); res.status(500).json({error:err.message||'Server error'}); });
const PORT=process.env.PORT||3005;
app.listen(PORT, ()=>console.log(`BeBold API on :${PORT}`));
