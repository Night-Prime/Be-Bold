import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentsApi } from '../api/client';
import { useCart } from '../context/CartContext';

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const [state, setState] = useState({ loading: true, verified: false, msg: 'Verifying payment…' });

  useEffect(() => {
    const txRef = params.get('tx_ref');
    const transactionId = params.get('transaction_id');
    const status = params.get('status');
    if (status === 'cancelled' || (!txRef && !transactionId)) {
      setState({ loading: false, verified: false, msg: 'Payment was cancelled.' });
      return;
    }
    paymentsApi.verify(txRef, transactionId)
      .then((r) => {
        if (r.verified) {
          clear();
          setState({ loading: false, verified: true, msg: `Payment successful! Order ${r.order?.id || ''} confirmed.` });
        } else {
          setState({ loading: false, verified: false, msg: 'Payment not confirmed. Please contact support with your reference: ' + txRef });
        }
      })
      .catch((e) => setState({ loading: false, verified: false, msg: e.response?.data?.error || 'Verification failed' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-28 min-h-screen bg-purple50 px-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-purple900 mb-4">Payment {state.loading ? '…' : state.verified ? 'Successful' : 'Unconfirmed'}</h1>
      <p className={`p-4 rounded-xl text-sm ${state.verified ? 'bg-green-50 text-green-700' : 'bg-white text-purple800'}`}>{state.msg}</p>
      {!state.loading && (
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/orders" className="px-6 py-3 bg-purple800 text-white rounded-full font-bold text-sm">View Orders</Link>
          <Link to="/shop" className="px-6 py-3 border rounded-full font-bold text-sm">Continue Shopping</Link>
        </div>
      )}
    </div>
  );
}
