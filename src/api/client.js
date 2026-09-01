import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(c => {
  const t = localStorage.getItem('token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
class Resource {
  constructor(path) { this.path = path; }
  list = (p) => api.get(this.path, { params: p }).then(r => r.data);
  get = (id) => api.get(`${this.path}/${id}`).then(r => r.data);
  create = (d) => api.post(this.path, d).then(r => r.data);
  update = (id, d) => api.put(`${this.path}/${id}`, d).then(r => r.data);
  remove = (id) => api.delete(`${this.path}/${id}`).then(r => r.data);
}
export default api;
export const productsApi = new Resource('/products');
export const categoriesApi = new Resource('/categories');
export const cartApi = {
  list: () => api.get('/cart').then(r => r.data),
  add: (d) => api.post('/cart', d).then(r => r.data),
  update: (id, q) => api.put(`/cart/${id}`, { quantity: q }).then(r => r.data),
  remove: (id) => api.delete(`/cart/${id}`).then(r => r.data),
};
export const ordersApi = {
  create: (d) => api.post('/orders', d).then(r => r.data),
  my: () => api.get('/orders/my').then(r => r.data),
  whatsapp: (d) => api.post('/orders/whatsapp', d).then(r => r.data),
};
export const authApi = {
  login: (d) => api.post('/auth/login', d).then(r => r.data),
  register: (d) => api.post('/auth/register', d).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};
