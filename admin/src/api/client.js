import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:3005/api' });
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c; });
class R { constructor(p){this.p=p} list=()=>api.get(this.p).then(r=>r.data); get=id=>api.get(this.p+'/'+id).then(r=>r.data); create=d=>api.post(this.p,d).then(r=>r.data); update=(id,d)=>api.put(this.p+'/'+id,d).then(r=>r.data); remove=id=>api.delete(this.p+'/'+id).then(r=>r.data); }
export default api;
export const productsApi=new R('/products');
export const categoriesApi=new R('/categories');
export const ordersApi = {
  list: () => api.get('/orders').then(r => r.data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }).then(r => r.data),
};
export const subscribersApi = {
  list: (q) => api.get('/subscribers', { params: q ? { q } : {} }).then(r => r.data),
  remove: (id) => api.delete(`/subscribers/${id}`).then(r => r.data),
  exportCsv: () => api.get('/subscribers/export', { responseType: 'blob' }).then(r => {
    const url = window.URL.createObjectURL(new Blob([r.data], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'bebold-subscribers.csv'; a.click();
    window.URL.revokeObjectURL(url);
  }),
};
export const uploadApi = {
  image: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r=>r.data);
  }
};
