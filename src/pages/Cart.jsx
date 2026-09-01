import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
export default function Cart() {
  const { items, remove, updateQty } = useCart();
  const total = items.reduce((s, i) => s + Number(i.price) * Number(i.qty || i.quantity || 1), 0);
  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-purple50 px-4 sm:px-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple900 mb-6">Your Cart</h1>
      {!items.length ? <p className="text-sm">Empty. <Link to="/shop" className="text-purple800 underline">Shop now</Link></p> : (
        <>
          <div className="space-y-3 sm:space-y-4">
            {items.map(it => (
              <div key={it.id} className="flex gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl items-center">
                <img src={it.image} alt={it.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-purple900 text-sm sm:text-base truncate">{it.name}</h3>
                  <p className="text-xs sm:text-sm">₦{Number(it.price).toLocaleString()} × {it.qty||it.quantity||1}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={()=>updateQty(it.id, Number(it.qty||1)-1)} className="w-7 h-7 border rounded-full text-sm">−</button>
                    <span className="text-sm w-6 text-center">{it.qty||it.quantity||1}</span>
                    <button onClick={()=>updateQty(it.id, Number(it.qty||1)+1)} className="w-7 h-7 border rounded-full text-sm">+</button>
                  </div>
                </div>
                <button onClick={() => remove(it.id)} className="text-red-500 text-xs sm:text-sm flex-shrink-0 px-2">Remove</button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <p className="text-xl sm:text-2xl font-bold">Total: ₦{total.toLocaleString()}</p>
            <Link to="/checkout" className="px-8 py-3 bg-purple800 text-white rounded-full font-bold text-center text-sm sm:text-base">Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
