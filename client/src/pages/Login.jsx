import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState('');
  const submit = async e => { e.preventDefault(); try { await login(f); nav('/'); } catch (ex) { setErr(ex.response?.data?.error || 'Login failed'); } };
  return (
    <div className="pt-28 min-h-screen bg-purple50 flex justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl w-full max-w-md shadow space-y-4 h-fit">
        <h1 className="text-2xl font-bold text-purple900">Welcome Back</h1>
        <input placeholder="Email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} className="w-full px-4 py-3 border rounded" required />
        <input placeholder="Password" type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} className="w-full px-4 py-3 border rounded" required />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button className="w-full py-3 bg-purple800 text-white rounded-full font-bold">Login</button>
        <p className="text-sm text-center">No account? <Link to="/register" className="text-purple800 underline">Register</Link></p>
        <p className="text-xs text-center text-gray-400">admin@bebold.com / admin123</p>
      </form>
    </div>
  );
}
