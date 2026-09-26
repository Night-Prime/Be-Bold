import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Layers, ShoppingBag, Mail, LogOut, Star, Menu, X, Sparkles } from 'lucide-react';
import Login from './pages/Login';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Subscribers from './pages/Subscribers';
import Dashboard from './pages/Dashboard';

function NavItem({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-full font-semibold text-sm tracking-wide transition-all ${active ? 'bg-purple200 text-white shadow-lg' : 'text-purple100/70 hover:text-white hover:bg-white/10'}`}>
      <Icon className="w-[18px] h-[18px] shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function Shell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const isActive = (p) => loc.pathname === p;
  const logout = () => { localStorage.clear(); window.location.href = '/login'; };
  const nav = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/categories', label: 'Categories', icon: Layers },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/subscribers', label: 'Email List', icon: Mail },
  ];
  return (
    <div className="min-h-screen bg-purple50 flex">
      <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="hidden lg:flex w-[280px] shrink-0 bg-purple900 text-purple100 flex-col sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple800/40 via-transparent to-purple900/60 pointer-events-none" />
        <motion.div animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-10 right-8 opacity-10 pointer-events-none"><Sparkles className="w-10 h-10" /></motion.div>
        <motion.div animate={{ y: [0, 6, 0], rotate: [0, -3, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-32 left-6 opacity-10 pointer-events-none"><Star className="w-16 h-16" /></motion.div>
        <div className="relative z-10 p-7 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-2 text-[22px] font-bold tracking-widest">
            <span>BE</span><Star className="w-4 h-4 fill-current text-purple200" /><span>BOLD</span>
            <span className="ml-2 text-[10px] tracking-[0.3em] font-semibold text-purple200/80 border border-purple200/30 rounded-full px-2 py-1">ADMIN</span>
          </Link>
          <p className="text-[11px] tracking-[0.2em] text-purple100/50 font-semibold mt-1">FAITH • BEAUTY • BOLD</p>
          <nav className="mt-10 space-y-2 flex-1">
            {nav.map(n => <NavItem key={n.to} to={n.to} icon={n.icon} label={n.label} active={isActive(n.to)} />)}
          </nav>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <p className="text-xs font-bold text-white">Need help?</p>
              <p className="text-[11px] text-purple100/60 mt-1 leading-relaxed">Manage products, track orders and shine with Be Bold.</p>
            </div>
            <button onClick={logout} className="mt-4 flex items-center gap-3 w-full px-4 py-3 rounded-full border border-white/10 text-purple100/80 hover:text-white hover:bg-white/10 transition font-semibold text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-purple900/60 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="fixed inset-y-0 left-0 w-[300px] bg-purple900 z-50 lg:hidden flex flex-col p-7 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl font-bold tracking-widest text-purple100"><span>BE</span><Star className="w-4 h-4 fill-current text-purple200" /><span>BOLD</span></span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-purple100 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <nav className="mt-8 space-y-2">
                {nav.map(n => <NavItem key={n.to} to={n.to} icon={n.icon} label={n.label} active={isActive(n.to)} onClick={() => setMobileOpen(false)} />)}
              </nav>
              <button onClick={logout} className="mt-auto flex items-center gap-3 w-full px-4 py-3 rounded-full bg-white/10 text-white font-semibold text-sm"><LogOut className="w-4 h-4" /> Logout</button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-purple900 border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-purple100"><Menu className="w-6 h-6" /></button>
            <span className="flex items-center gap-1.5 font-bold tracking-widest text-purple100"><span>BE</span><Star className="w-3.5 h-3.5 fill-current text-purple200" /><span>BOLD</span><span className="text-[9px] tracking-[0.2em] ml-1 text-purple200/80">ADMIN</span></span>
            <button onClick={logout} className="p-2 text-purple100/70"><LogOut className="w-5 h-5" /></button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>{children}</motion.div>
        </main>
      </div>
    </div>
  );
}

function Guard({ children }) {
  const t = localStorage.getItem('token');
  if (!t) return <Navigate to="/login" />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Guard><Dashboard /></Guard>} />
        <Route path="/products" element={<Guard><Products /></Guard>} />
        <Route path="/categories" element={<Guard><Categories /></Guard>} />
        <Route path="/orders" element={<Guard><Orders /></Guard>} />
        <Route path="/subscribers" element={<Guard><Subscribers /></Guard>} />
      </Routes>
    </BrowserRouter>
  );
}
