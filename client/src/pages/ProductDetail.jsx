import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/client';
import { resolveProductImage } from '../api/images';
import { ProductDetailSkeleton } from '../components/shared/Loader';
import { useCart } from '../context/CartContext';
export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productsApi.get(id)
      .then((d) => { if (!cancelled) setP(d); })
      .catch(() => { if (!cancelled) setP(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-purple50 px-4 sm:px-6 max-w-6xl mx-auto">
      <Link to="/shop" className="text-sm text-purple800 underline">← Back to Shop</Link>
      {loading ? (
        <ProductDetailSkeleton />
      ) : !p ? (
        <div className="text-center py-20">
          <p className="text-purple900 font-bold mb-2">Product not found</p>
          <p className="text-sm text-purple800/60 mb-6">It may have been removed or the link is invalid.</p>
          <Link to="/shop" className="px-8 py-3 bg-purple800 text-white font-bold rounded-full text-sm">Back to Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-4">
          <img src={resolveProductImage(p.image)} alt={p.name} className="w-full h-80 sm:h-[420px] lg:h-[500px] object-cover rounded-xl" />
          <div className="py-2 sm:py-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple900">{p.name}</h1>
            <p className="text-purple800/70 mt-2 text-sm sm:text-base">{p.description}</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple900 mt-4 sm:mt-6">₦{Number(p.price).toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-purple800/50 mt-1">{p.stock ?? 100} in stock</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6">
              <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-full sm:w-20 px-3 py-3 border rounded-lg text-center" />
              <button onClick={() => add(p, qty)} className="flex-1 sm:flex-none px-8 py-3 bg-purple800 text-white font-bold rounded-full text-sm sm:text-base">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
