const r = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { sign } = require('../utils/jwt');

r.post('/register', async (req,res)=>{
  const { name,email,password }=req.body;
  if(!email||!password) return res.status(400).json({error:'Missing fields'});
  const hash = await bcrypt.hash(password,10);
  try{
    const { rows } = await pool.query(`INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,'customer') RETURNING id,name,email,role`,[name,email,hash]);
    const token = sign({ id: rows[0].id, email: rows[0].email, role: rows[0].role });
    res.json({ user: rows[0], token });
  }catch(e){ res.status(400).json({error: e.message.includes('duplicate')?'Email exists':e.message});}
});

r.post('/login', async (req,res)=>{
  const {email,password}=req.body;
  // Env admin override — allows login without DB seed if ADMIN_EMAIL/PASSWORD set
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const adminUser = { id: process.env.ADMIN_ID || '00000000-0000-0000-0000-000000000000', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin' };
      const token = sign(adminUser);
      return res.json({ user: adminUser, token });
    }
  }
  const { rows } = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
  const u = rows[0]; if(!u) return res.status(401).json({error:'Invalid credentials'});
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  const token = sign({ id:u.id,email:u.email,role:u.role });
  res.json({ user:{id:u.id,name:u.name,email:u.email,role:u.role}, token });
});

r.get('/me', require('../middleware/auth').auth, async (req,res)=>{
  const { rows } = await pool.query(`SELECT id,name,email,role FROM users WHERE id=$1`,[req.user.id]);
  res.json(rows[0]);
});
module.exports=r;
