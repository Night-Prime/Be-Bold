import { useEffect, useState, useCallback } from 'react';
import { productsApi, categoriesApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const { add } = useCart();
  const load = useCallback(async () => {
    try {
      const p = await productsApi.list(cat ? { category_id: cat } : {});
      setProducts(q ? p.filter(x => x.name.toLowerCase().includes(q.toLowerCase())) : p);
    } catch { setProducts([]); }
  }, [cat, q]);
  useEffect(() => { categoriesApi.list().then(setCats).catch(()=>{}); }, []);
  useEffect(() => { load(); }, [load]);
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-purple50 px-4 sm:px-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple900 mb-4 sm:mb-6">SHOP COLLECTION</h1>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} className="flex-1 px-4 py-2.5 border rounded-full text-sm w-full" />
        <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 border rounded-full text-sm w-full sm:w-auto">
          <option value="">All Categories</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-20">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow flex flex-col">
            <Link to={`/product/${p.id}`} className="block aspect-square overflow-hidden bg-purple50"><img src={p.image?.startsWith('/') ? p.image : p.image} alt={p.name} className="h-full w-full object-cover hover:scale-105 transition duration-300" onError={e => e.target.style.background='#F3E8FF'} /></Link>
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <h3 className="font-bold text-purple900 text-xs sm:text-sm line-clamp-1">{p.name}</h3>
              <p className="text-purple800/70 text-xs line-clamp-2 mt-1 min-h-[32px]">{p.description}</p>
              <p className="font-bold text-purple900 mt-2 text-sm sm:text-base">₦{Number(p.price).toLocaleString()}</p>
              <button onClick={() => add(p)} className="w-full mt-3 py-2 border-2 border-purple800 text-purple800 font-bold text-xs sm:text-sm rounded-full hover:bg-purple800 hover:text-white transition">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      {!products.length && <p className="text-center text-purple800/50 py-20 text-sm">No products</p>}
    </div>
  );
}
