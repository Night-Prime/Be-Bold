import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
export default function Register() {
  const { register } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' }); const [err, setErr] = useState('');
  const submit = async e => { e.preventDefault(); try { await register(f); nav('/'); } catch (ex) { setErr(ex.response?.data?.error || 'Failed'); } };
  return (
    <div className="pt-28 min-h-screen bg-purple50 flex justify-center">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl w-full max-w-md shadow space-y-4 h-fit">
        <h1 className="text-2xl font-bold text-purple900">Create Account</h1>
        <input placeholder="Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className="w-full px-4 py-3 border rounded" />
        <input placeholder="Email" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} className="w-full px-4 py-3 border rounded" required />
        <input placeholder="Password" type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} className="w-full px-4 py-3 border rounded" required />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button className="w-full py-3 bg-purple800 text-white rounded-full font-bold">Register</button>
        <p className="text-sm text-center">Have account? <Link to="/login" className="text-purple800 underline">Login</Link></p>
      </form>
    </div>
  );
}
