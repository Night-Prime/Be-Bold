import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/client';
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const login = async (data) => {
    const r = await authApi.login(data);
    localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user));
    setUser(r.user); setToken(r.token); return r;
  };
  const register = async (data) => {
    const r = await authApi.register(data);
    localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user));
    setUser(r.user); setToken(r.token); return r;
  };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setToken(null); };
  useEffect(() => { if (token && !user) authApi.me().then(setUser).catch(logout); }, [token, user]);
  return <Ctx.Provider value={{ user, token, login, register, logout, isAdmin: user?.role === 'admin' }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
