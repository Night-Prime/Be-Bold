const pool=require('./config/db');
const bcrypt=require('bcryptjs');
async function seed(){
  const hash=await bcrypt.hash('admin123',10);
  const chash=await bcrypt.hash('password123',10);
  await pool.query(`INSERT INTO users (name,email,password,role) VALUES ('Admin','admin@bebold.com',$1,'admin') ON CONFLICT (email) DO NOTHING`,[hash]);
  await pool.query(`INSERT INTO users (name,email,password,role) VALUES ('Test User','user@test.com',$1,'customer') ON CONFLICT (email) DO NOTHING`,[chash]);
  const cats=await pool.query(`INSERT INTO categories (name,slug,description) VALUES ('Lip Gloss','lip-gloss','Velvet & matte glosses'),('Lip Liner','lip-liner','Satin liners'),('Skincare','skincare','Nourishing care') ON CONFLICT (slug) DO NOTHING RETURNING *`);
  let catsRows=(await pool.query(`SELECT * FROM categories`)).rows;
  const gloss=catsRows.find(c=>c.slug==='lip-gloss')?.id;
  const liner=catsRows.find(c=>c.slug==='lip-liner')?.id;
  const products=[
    {name:"ESTHER'S COURAGE",slug:'esthers-courage',description:'Velvet Lip Gloss - For such a time as this',price:5000,image:'/product-1.jpeg',category_id:gloss,featured:true},
    {name:"RUTH'S LOYALTY",slug:'ruths-loyalty',description:'Satin Lip Liner - Where you go I will go',price:5000,image:'/product-5.jpeg',category_id:liner,featured:true},
    {name:"DEBORAH'S STRENGTH",slug:'deborahs-strength',description:'Matte Lip Gloss - She leads with courage',price:5000,image:'/product-3.jpeg',category_id:gloss,featured:true},
    {name:"MARY'S GRACE",slug:'marys-grace',description:'Shimmer Lip Gloss - Blessed among women',price:5000,image:'/product-4.jpeg',category_id:gloss,featured:true},
    {name:"BOLD NUDE ESSENCE",slug:'bold-nude',description:'Everyday nude gloss with vitamin E',price:4500,image:'/product-1.jpeg',category_id:gloss},
    {name:"FAITH FUCHSIA",slug:'faith-fuchsia',description:'Bold fuchsia for fearless days',price:5500,image:'/product-3.jpeg',category_id:gloss},
  ];
  for(const p of products){
    await pool.query(`INSERT INTO products (name,slug,description,price,image,category_id,featured) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (slug) DO NOTHING`,[p.name,p.slug,p.description,p.price,p.image,p.category_id,p.featured||false]);
  }
  console.log('Seeded: admin@bebold.com / admin123 and user@test.com / password123'); process.exit(0);
}
seed().catch(e=>{console.error(e);process.exit(1)});
