import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/client';
import { useCart } from '../context/CartContext';
export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  useEffect(() => { productsApi.get(id).then(setP).catch(()=>{}); }, [id]);
  if (!p) return <div className="pt-28 text-center text-sm">Loading...</div>;
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-purple50 px-4 sm:px-6 max-w-6xl mx-auto">
      <Link to="/shop" className="text-sm text-purple800 underline">← Back to Shop</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-4">
        <img src={p.image} alt={p.name} className="w-full h-80 sm:h-[420px] lg:h-[500px] object-cover rounded-xl" />
        <div className="py-2 sm:py-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple900">{p.name}</h1>
          <p className="text-purple800/70 mt-2 text-sm sm:text-base">{p.description}</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple900 mt-4 sm:mt-6">₦{Number(p.price).toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-purple800/50 mt-1">{p.stock ?? 100} in stock</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6">
            <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1,Number(e.target.value)||1))} className="w-full sm:w-20 px-3 py-3 border rounded-lg text-center" />
            <button onClick={() => add(p, qty)} className="flex-1 sm:flex-none px-8 py-3 bg-purple800 text-white font-bold rounded-full text-sm sm:text-base">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
