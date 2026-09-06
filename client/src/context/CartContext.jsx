import { createContext, useContext, useState, useEffect } from 'react';
const Ctx = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);
  const count = items.reduce((s, i) => s + Number(i.qty || i.quantity || 1), 0);
  const add = (product, qty = 1) => {
    const q = Math.max(1, parseInt(qty) || 1);
    setItems(prev => {
      const c = [...prev];
      const f = c.find(i => String(i.id) === String(product.id));
      if (f) f.qty = Number(f.qty || f.quantity || 1) + q;
      else c.push({ id: product.id, name: product.name, price: product.price, image: product.image, description: product.description, qty: q });
      return c;
    });
  };
  const remove = (id) => setItems(prev => prev.filter(i => String(i.id) !== String(id)));
  const updateQty = (id, qty) => {
    const q = Math.max(1, parseInt(qty) || 1);
    setItems(prev => prev.map(i => String(i.id) === String(id) ? { ...i, qty: q } : i));
  };
  const clear = () => setItems([]);
  return <Ctx.Provider value={{ items, count, add, remove, updateQty, clear }}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
