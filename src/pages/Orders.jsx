import { useEffect, useState } from 'react';
import { ordersApi } from '../api/client';
export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { ordersApi.my().then(setOrders).catch(()=>{}); }, []);
  return (
    <div className="pt-24 min-h-screen bg-purple50 px-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-purple900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-4 rounded-xl flex justify-between">
            <span className="font-mono text-xs">{o.id.slice(0, 8)}</span>
            <span>₦{Number(o.total).toLocaleString()}</span>
            <span className="px-3 py-1 bg-purple100 rounded-full text-xs">{o.status}</span>
            <span className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</span>
          </div>
        ))}
        {!orders.length && <p className="text-center text-gray-400">No orders yet</p>}
      </div>
    </div>
  );
}
