import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../api/client';

export default function Login() {
  const [f, setF] = useState({ email: 'admin@bebold.com', password: 'admin123' });
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', f);
      if (data.user.role !== 'admin') return setErr('Not admin — access denied');
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (ex) { setErr(ex.response?.data?.error || 'Login failed — check credentials'); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-purple900 flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple900 via-purple800 to-purple500" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <motion.div animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-24 left-16 text-purple100/40"><Sparkles className="w-10 h-10" /></motion.div>
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} className="absolute bottom-24 right-16 text-purple100/30"><Star className="w-20 h-20" /></motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} className="absolute top-1/2 left-1/3 text-purple200/20"><Sparkles className="w-6 h-6" /></motion.div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full max-w-[640px]">
          <div className="flex items-center gap-2 text-purple100 font-bold tracking-widest text-xl"><span>BE</span><Star className="w-4 h-4 fill-current text-purple200" /><span>BOLD</span><span className="ml-2 text-[10px] tracking-[0.28em] border border-white/20 rounded-full px-2 py-1 text-purple100/70">ADMIN</span></div>
          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-[0.2em] text-purple100">FAITH • BEAUTY • BOLD</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-5xl font-bold leading-[0.95] text-purple100">You don’t need<br /><span className="text-purple200">more makeup.</span><br />Just <span className="italic font-serif">bolder</span> ones.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-purple100/70 leading-relaxed">Faith-inspired beauty for every shade, every story. Sign in to curate the collection that empowers women to walk boldly.</motion.p>
            <div className="mt-8 border-l-2 border-purple200 pl-4">
              <p className="font-serif italic text-purple100 text-sm">“She is clothed with strength and dignity”</p>
              <p className="text-[11px] tracking-widest text-purple200 mt-1">— PROVERBS 31:25</p>
            </div>
          </div>
          <p className="text-xs text-purple100/40">© 2025 Be Bold • Made with faith</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-purple50 lg:bg-white relative">
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-purple900 via-purple800 to-purple900" />
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-[420px] bg-white rounded-[28px] p-8 shadow-2xl border border-purple100">
          <div className="lg:hidden flex items-center gap-2 justify-center font-bold tracking-widest text-purple900 text-lg"><span>BE</span><Star className="w-4 h-4 fill-current text-purple800" /><span>BOLD</span></div>
          <div className="mt-1 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple50 border border-purple100 text-[11px] font-bold tracking-[0.16em] text-purple800"><ShieldCheck className="w-3.5 h-3.5" /> SECURE ADMIN ACCESS</span>
            <h2 className="mt-4 text-2xl font-bold text-purple900">Welcome back</h2>
            <p className="text-sm text-purple800/50 mt-1">Sign in to manage your bold collection</p>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold tracking-widest text-purple800/60">EMAIL</label>
              <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="admin@bebold.com" className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border-2 border-purple100 bg-purple50/50 text-purple900 placeholder:text-purple800/30 focus:outline-none focus:border-purple400 focus:bg-white transition text-sm" />
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest text-purple800/60">PASSWORD</label>
              <div className="mt-1.5 relative">
                <input type={show ? 'text' : 'password'} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-3.5 pr-12 rounded-2xl border-2 border-purple100 bg-purple50/50 text-purple900 focus:outline-none focus:border-purple400 focus:bg-white transition text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-purple800/40 hover:text-purple800">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            {err && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{err}</motion.p>}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className="w-full py-4 rounded-full bg-purple800 text-white font-bold shadow-lg hover:bg-purple900 transition disabled:opacity-60 text-sm tracking-wide">
              {loading ? 'Signing in…' : 'Sign In →'}
            </motion.button>
            <p className="text-center text-xs text-purple800/40">Protected • Only admins can access this dashboard</p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
