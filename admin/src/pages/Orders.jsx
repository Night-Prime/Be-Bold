import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { ShoppingBag, Search, Package, Clock, CreditCard, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'Paid', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CreditCard },
  shipped: { label: 'Shipped', cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: Truck },
  delivered: { label: 'Delivered', cls: 'bg-purple50 text-purple800 border-purple200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
};

export default function Orders() {
  const [list, setList] = useState([]); const [q, setQ] = useState(''); const [filter, setFilter] = useState('');
  const load = () => api.get('/orders').then(r => setList(r.data)).catch(() => {});
  useEffect(() => { load() }, []);
  const update = async (id, status) => { await api.put(`/orders/${id}/status`, { status }); load(); };
  const filtered = list.filter(o => (!q || o.id.toLowerCase().includes(q.toLowerCase()) || (o.user_name || '').toLowerCase().includes(q.toLowerCase())) && (!filter || o.status === filter));
  const counts = { total: list.length, pending: list.filter(o => o.status === 'pending').length, paid: list.filter(o => o.status === 'paid').length };
  return (
    <div className="space-y-5">
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple100 text-[11px] font-bold tracking-[0.16em] text-purple800">{list.length} ORDERS</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-purple900 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-purple900 text-white grid place-items-center"><ShoppingBag className="w-4 h-4" /></span> Orders</h1>
        <p className="text-sm text-purple800/50 mt-1">Track and fulfill bold beauty orders.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ k: 'Total', v: counts.total }, { k: 'Pending', v: counts.pending }, { k: 'Paid', v: counts.paid }].map(s => (
          <div key={s.k} className="bg-white rounded-2xl border border-purple100 p-4">
            <p className="text-[11px] font-bold tracking-widest text-purple800/40">{s.k.toUpperCase()}</p>
            <p className="text-2xl font-bold text-purple900 mt-1">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[22px] border border-purple100 p-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple800/30" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by ID or customer…" className="w-full pl-11 pr-4 py-3 rounded-full border border-purple100 bg-purple50/50 focus:bg-white focus:border-purple300 focus:outline-none text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 rounded-full border border-purple100 bg-purple50/50 text-sm focus:outline-none focus:border-purple300">
          <option value="">All statuses</option><option>pending</option><option>paid</option><option>shipped</option><option>delivered</option><option>cancelled</option>
        </select>
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map(o => {
            const cfg = statusConfig[o.status] || statusConfig.pending; const Icon = cfg.icon;
            return (
              <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[22px] border border-purple100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                <div className="flex gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-purple900 text-white grid place-items-center shrink-0"><Package className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-purple900">#{o.id.slice(0, 8).toUpperCase()} <span className="font-sans font-normal text-purple800/40">• {new Date(o.created_at || Date.now()).toLocaleDateString()}</span></p>
                    <p className="font-bold text-purple900 truncate">{o.user_name || 'Guest'}</p>
                    <p className="text-xs text-purple800/50 truncate max-w-[36ch]">{o.address || 'No address'} {o.phone ? `• ${o.phone}` : ''}</p>
                    <p className="font-bold text-purple900 mt-1">₦{Number(o.total).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col lg:flex-row">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.cls}`}><Icon className="w-3.5 h-3.5" /> {cfg.label}</span>
                  <select value={o.status} onChange={e => update(o.id, e.target.value)} className="px-3 py-2 rounded-full border-2 border-purple100 bg-white text-xs font-bold text-purple900 focus:border-purple400 focus:outline-none">
                    <option>pending</option><option>paid</option><option>shipped</option><option>delivered</option><option>cancelled</option>
                  </select>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[22px] border border-purple100 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple50 border border-purple100 grid place-items-center mx-auto text-purple400"><ShoppingBag className="w-6 h-6" /></div>
          <p className="mt-4 font-bold text-purple900">No orders found</p>
          <p className="text-sm text-purple800/50">Orders will appear here once customers checkout.</p>
        </div>
      )}
    </div>
  );
}
