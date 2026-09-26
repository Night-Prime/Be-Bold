import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { subscribersApi } from '../api/client';
import { Mail, Search, Download, Trash2, Users } from 'lucide-react';

export default function Subscribers() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    subscribersApi.list(q)
      .then((d) => setList(Array.isArray(d) ? d : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      subscribersApi.list(q).then((d) => setList(Array.isArray(d) ? d : [])).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [q]);
  const remove = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    await subscribersApi.remove(id).catch(() => {});
    setList((prev) => prev.filter((s) => s.id !== id));
  };
  return (
    <div className="space-y-5">
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple100 text-[11px] font-bold tracking-[0.16em] text-purple800">{list.length} SUBSCRIBERS</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-purple900 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-purple900 text-white grid place-items-center"><Mail className="w-4 h-4" /></span> Email List</h1>
        <p className="text-sm text-purple800/50 mt-1">Everyone who subscribed via the landing page newsletter.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-purple100 p-4">
          <p className="text-[11px] font-bold tracking-widest text-purple800/40">TOTAL SUBSCRIBERS</p>
          <p className="text-2xl font-bold text-purple900 mt-1">{list.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-purple100 p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-purple800/40">EXPORT</p>
            <p className="text-sm font-semibold text-purple900 mt-1">Download as CSV</p>
          </div>
          <button onClick={() => subscribersApi.exportCsv()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple900 text-white text-xs font-bold hover:bg-purple800 transition">
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[22px] border border-purple100 p-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple800/30" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by email…" className="w-full pl-11 pr-4 py-3 rounded-full border border-purple100 bg-purple50/50 focus:bg-white focus:border-purple300 focus:outline-none text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[22px] border border-purple100 p-12 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-purple100 border-t-purple800 animate-spin mx-auto" />
          <p className="mt-4 text-sm text-purple800/50">Loading subscribers…</p>
        </div>
      ) : list.length ? (
        <div className="bg-white rounded-[22px] border border-purple100 overflow-hidden">
          <div className="divide-y divide-purple50">
            {list.map(s => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-purple50/60 transition">
                <div className="flex gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-purple50 border border-purple100 text-purple800 grid place-items-center shrink-0"><Users className="w-5 h-5" /></div>
                  <div className="min-w-0">
                    <p className="font-bold text-purple900 truncate">{s.email}</p>
                    <p className="text-xs text-purple800/50">{s.name ? `${s.name} • ` : ''}{s.source || 'landing'} • {new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => remove(s.id)} title="Remove subscriber" className="p-2.5 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[22px] border border-purple100 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple50 border border-purple100 grid place-items-center mx-auto text-purple400"><Mail className="w-6 h-6" /></div>
          <p className="mt-4 font-bold text-purple900">No subscribers yet</p>
          <p className="text-sm text-purple800/50">Emails will appear here once visitors subscribe on the landing page.</p>
        </div>
      )}
    </div>
  );
}
