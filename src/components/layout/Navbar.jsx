import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Star, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { count } = useCart();
    const { user, logout } = useAuth();
    const nav = useNavigate();
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
    }, []);
    const navItems = [
        { name: "Shop", href: "/shop" },
        { name: "Orders", href: "/orders" },
    ];
    return (
        <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed w-full z-50 rounded-b-sm shadow-lg border-b-2 border-purple800 bg-purple800 ${scrolled ? 'shadow-md py-3 sm:py-4' : 'py-4 sm:py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-purple100 gap-2 w-full overflow-hidden">
                <Link to="/" className="text-xl sm:text-2xl font-bold tracking-wider flex gap-1.5 sm:gap-2 items-center flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <span>BE</span><Star className="w-4 h-4 fill-current" /><span>BOLD</span>
                </Link>
                <div className="hidden md:flex items-center font-bold space-x-8">
                    {navItems.map((item, i) => (
                        <Link key={i} to={item.href} className="text-white hover:text-purple100 relative group">{item.name}</Link>
                    ))}
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    {user ? (
                        <>
                            <span className="hidden sm:inline text-sm truncate max-w-[80px]">{user.name}</span>
                            <button onClick={() => { logout(); nav('/'); }} className="text-white p-1"><LogOut className="w-5 h-5" /></button>
                        </>
                    ) : (
                        <Link to="/login" className="text-white flex items-center gap-1 text-sm whitespace-nowrap"><User className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden xs:inline">Login</span></Link>
                    )}
                    <Link to="/cart" className="text-white relative p-1"><ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" /><span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-purple200 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">{count}</span></Link>
                    <button className="md:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
                </div>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white/95 mt-4">
                        <div className="px-6 py-4 space-y-4">
                            {navItems.map((it, i) => <Link key={i} to={it.href} onClick={() => setIsMenuOpen(false)} className="block text-purple800 font-semibold">{it.name}</Link>)}
                            {!user ? <Link to="/login" className="block text-purple800">Login / Register</Link> : <button onClick={logout} className="block text-purple800">Logout</button>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
