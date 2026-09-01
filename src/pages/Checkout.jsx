import { useState } from 'react';
import { ordersApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
const ENABLE_PAYMENT = process.env.REACT_APP_ENABLE_PAYMENT === 'true';
const WHATSAPP_NUMBER = (process.env.REACT_APP_WHATSAPP_NUMBER || '2348123456789').replace(/\D/g,'');
export default function Checkout() {
  const { items, clear } = useCart();
  const total = items.reduce((s, i) => s + Number(i.price) * Number(i.qty || i.quantity || 1), 0);
  const [form, setForm] = useState({ name:'', address:'', phone:'' });
  const [msg, setMsg] = useState('');
  const [placing, setPlacing] = useState(false);
  if (!items.length) return <div className="pt-28 text-center px-6">Cart empty. <Link to="/shop" className="underline text-purple800">Shop now</Link></div>;
  const buildWhatsAppMessage = () => {
    const lines = ['Hello Be Bold! 👋','', 'I want to place an order:',''];
    items.forEach((it,i)=>{ const q=it.qty||it.quantity||1; lines.push(`${i+1}. ${it.name} x${q} - ₦${(Number(it.price)*q).toLocaleString()}`); });
    lines.push('', `*Total: ₦${total.toLocaleString()}*`,'');
    if(form.name) lines.push(`Name: ${form.name}`);
    if(form.phone) lines.push(`Phone: ${form.phone}`);
    if(form.address) lines.push(`Address: ${form.address}`);
    return lines.join('\n');
  };
  const handleWhatsApp = (e) => {
    e.preventDefault();
    const message = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url,'_blank');
    setMsg('Opening WhatsApp…');
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    setPlacing(true); setMsg('');
    try { const o = await ordersApi.create({ address: form.address, phone: form.phone }); setMsg('Order '+o.id+' placed!'); clear(); setTimeout(()=>window.location.href='/orders',1500); }
    catch(err){ setMsg(err.response?.data?.error||'Failed to place order'); }
    finally{ setPlacing(false); }
  };
  return (
    <div className="pt-24 min-h-screen bg-purple50 px-4 sm:px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple900 mb-6">Checkout</h1>
      <div className="bg-white p-4 sm:p-6 rounded-xl mb-6">
        <h2 className="font-bold text-purple900 mb-3">Order Summary</h2>
        <div className="space-y-2 divide-y">
          {items.map(it=>(
            <div key={it.id} className="flex justify-between py-2 text-sm">
              <span className="font-medium text-purple900 flex-1 pr-4">{it.name} <span className="text-purple800/60">x{it.qty||it.quantity||1}</span></span>
              <span className="font-bold text-purple900">₦{(Number(it.price)*Number(it.qty||it.quantity||1)).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg text-purple900"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
      </div>
      {ENABLE_PAYMENT ? (
        <form onSubmit={handlePayment} className="space-y-4 bg-white p-4 sm:p-6 rounded-xl">
          <p className="text-sm text-green-700 bg-green-50 p-3 rounded">Payment gateway enabled</p>
          <input placeholder="Delivery Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base" required />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base" required />
          <button disabled={placing} className="w-full py-3 bg-purple800 text-white rounded-full font-bold text-sm sm:text-base disabled:opacity-60">{placing?'Placing…':'Pay & Place Order'}</button>
          {msg && <p className="text-center text-sm text-purple800">{msg}</p>}
        </form>
      ) : (
        <form onSubmit={handleWhatsApp} className="space-y-4 bg-white p-4 sm:p-6 rounded-xl">
          <p className="text-sm text-purple800/70 bg-purple50 p-3 rounded-lg">You will be redirected to WhatsApp to complete your order. No login required.</p>
          <input placeholder="Your Name (optional)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base" />
          <input placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base" />
          <input placeholder="Delivery Address (optional)" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full px-4 py-3 border rounded-lg text-sm sm:text-base" />
          <button className="w-full py-3 bg-[#25D366] text-white rounded-full font-bold flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-[#128C7E]">Order via WhatsApp</button>
          <p className="text-xs text-center text-purple800/50">Message will include product list and total</p>
          {msg && <p className="text-center text-sm text-green-600">{msg}</p>}
          {WHATSAPP_NUMBER && <p className="text-xs text-center text-purple800/40">Sending to: +{WHATSAPP_NUMBER}</p>}
        </form>
      )}
    </div>
  );
}
