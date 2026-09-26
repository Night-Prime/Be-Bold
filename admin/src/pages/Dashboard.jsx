import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Layers, ShoppingBag, TrendingUp, Sparkles, ArrowUpRight, Star, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { productsApi, categoriesApi, subscribersApi } from '../api/client';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, subscribers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    Promise.all([productsApi.list().catch(() => []), categoriesApi.list().catch(() => []), api.get('/orders').then(r => r.data).catch(() => []), subscribersApi.list().catch(() => [])]).then(([p, c, o, s]) => {
      setStats({ products: p.length, categories: c.length, orders: o.length, subscribers: s.length });
      setProducts(p.slice(0, 4));
      setRecentOrders(o.slice(0, 5));
    });
  }, []);
  const cards = [
    { label: 'Products', value: stats.products, icon: Package, to: '/products', gradient: 'from-purple800 to-purple500', accent: 'bg-purple200', sub: 'Live catalog' },
    { label: 'Categories', value: stats.categories, icon: Layers, to: '/categories', gradient: 'from-purple900 to-purple800', accent: 'bg-purple300', sub: 'Organized' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, to: '/orders', gradient: 'from-purple500 to-purple400', accent: 'bg-purple100', sub: 'Total received' },
    { label: 'Subscribers', value: stats.subscribers, icon: Mail, to: '/subscribers', gradient: 'from-purple800 to-purple400', accent: 'bg-purple100', sub: 'Email list' },
  ];
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-[28px] bg-purple900 p-6 sm:p-8 text-purple100">
        <div className="absolute inset-0 bg-gradient-to-br from-purple800 via-purple900 to-[#0C0420]" />
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-6 right-10 opacity-15"><Sparkles className="w-8 h-8" /></motion.div>
        <motion.div animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-6 right-28 opacity-10"><Star className="w-16 h-16" /></motion.div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-[0.18em] text-purple100">BE BOLD ADMIN ✦ TODAY</span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Welcome back, Queen.</h1>
            <p className="mt-2 text-purple100/70 max-w-xl text-sm leading-relaxed">Faith-inspired overview — track products, categories and orders at a glance. Keep walking boldly in purpose.</p>
            <p className="mt-3 text-xs font-serif italic text-purple200">“She is clothed with strength and dignity” — Proverbs 31:25</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/products" className="px-6 py-3 rounded-full bg-purple200 text-white font-bold text-sm shadow-lg hover:bg-purple300 transition">Add Product</Link>
            <Link to="/orders" className="px-6 py-3 rounded-full bg-white/10 border border-white/15 text-white font-bold text-sm backdrop-blur hover:bg-white/15 transition">View Orders</Link>
          </div>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <motion.div key={c.label} variants={item} whileHover={{ y: -4 }} className="relative overflow-hidden bg-white rounded-[22px] p-6 border border-purple100 shadow-sm">
            <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${c.gradient} opacity-[0.08] rounded-bl-[100px]`} />
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shadow-md`}><c.icon className="w-5 h-5" /></div>
              <Link to={c.to} className="w-8 h-8 rounded-full bg-purple50 border border-purple100 flex items-center justify-center text-purple800 hover:bg-purple800 hover:text-white transition"><ArrowUpRight className="w-4 h-4" /></Link>
            </div>
            <p className="mt-5 text-[11px] font-bold tracking-[0.18em] text-purple800/50 uppercase">{c.label}</p>
            <p className="text-3xl font-bold text-purple900 mt-1">{c.value}</p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600"><TrendingUp className="w-3.5 h-3.5" /> {c.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2 bg-white rounded-[22px] border border-purple100 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b border-purple50">
            <h3 className="font-bold text-purple900">Recent Orders</h3>
            <Link to="/orders" className="text-xs font-bold tracking-widest text-purple800 hover:text-purple500">VIEW ALL →</Link>
          </div>
          {recentOrders.length ? (
            <div className="divide-y divide-purple50">
              {recentOrders.map(o => (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-purple50/60 transition">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-purple900">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-semibold text-purple900 truncate">{o.user_name || 'Guest'} <span className="text-purple800/40 font-normal">• {o.address?.slice(0, 32) || 'No address'}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-purple900 text-sm">₦{Number(o.total).toLocaleString()}</p>
                    <span className={`inline-flex mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize border ${o.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : o.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : o.status === 'shipped' ? 'bg-sky-50 text-sky-700 border-sky-200' : o.status === 'delivered' ? 'bg-purple50 text-purple800 border-purple100' : 'bg-red-50 text-red-600 border-red-200'}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple50 border border-purple100 flex items-center justify-center mx-auto text-purple800"><ShoppingBag className="w-6 h-6" /></div>
              <p className="mt-4 font-bold text-purple900">No orders yet</p>
              <p className="text-sm text-purple800/50">Orders will appear here when customers check out.</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-[22px] border border-purple100 overflow-hidden">
          <div className="px-6 py-5 border-b border-purple50 flex items-center justify-between">
            <h3 className="font-bold text-purple900">Top Products</h3>
            <Link to="/products" className="text-xs font-bold tracking-widest text-purple800 hover:text-purple500">MANAGE →</Link>
          </div>
          <div className="p-3 space-y-3">
            {products.length ? products.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-purple50 transition border border-transparent hover:border-purple100">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple50 shrink-0 border border-purple100">
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="w-full h-full grid place-items-center text-purple300"><Package className="w-5 h-5" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-purple900 truncate">{p.name}</p>
                  <p className="text-xs text-purple800/50">₦{Number(p.price).toLocaleString()} • {p.featured ? 'Featured' : 'Standard'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${p.stock > 20 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : p.stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{p.stock ?? 0} left</span>
              </div>
            )) : <p className="p-8 text-center text-sm text-purple800/40">No products yet — create your first bold beauty.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
