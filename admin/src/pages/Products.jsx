import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, categoriesApi, uploadApi } from '../api/client';
import { Package, Search, Plus, Pencil, Trash2, X, Sparkles, Star, Upload, Loader2 } from 'lucide-react';

export default function Products() {
  const [list, setList] = useState([]); const [cats, setCats] = useState([]);
  const [q, setQ] = useState(''); const [catFilter, setCatFilter] = useState('');
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', category_id: '', stock: 100, featured: false });
  const [edit, setEdit] = useState(null); const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const load = () => productsApi.list().then(setList).catch(() => {});
  useEffect(() => { load(); categoriesApi.list().then(setCats).catch(() => {}); }, []);
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.image(file);
      setForm(f => ({ ...f, image: res.url }));
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed');
    } finally { setUploading(false); }
  };
  const submit = async e => {
    e.preventDefault();
    const data = { ...form, price: Number(form.price) };
    if (edit) await productsApi.update(edit, data); else await productsApi.create(data);
    setForm({ name: '', price: '', description: '', image: '', category_id: '', stock: 100, featured: false }); setEdit(null); setOpen(false); load();
  };
  const del = async id => { if (!window.confirm('Delete product?')) return; await productsApi.remove(id); load(); };
  const filtered = list.filter(p => (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!catFilter || String(p.category_id) === String(catFilter)));
  const startCreate = () => { setEdit(null); setForm({ name: '', price: '', description: '', image: '', category_id: '', stock: 100, featured: false }); setOpen(true); };
  const startEdit = p => { setEdit(p.id); setForm({ name: p.name, price: p.price, description: p.description || '', image: p.image || '', category_id: p.category_id || '', stock: p.stock ?? 100, featured: !!p.featured }); setOpen(true); };
  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple100 text-[11px] font-bold tracking-[0.16em] text-purple800">CATALOG • {list.length} ITEMS</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-purple900 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-purple900 text-white grid place-items-center"><Package className="w-4 h-4" /></span> Products</h1>
          <p className="text-sm text-purple800/50 mt-1">Curate the bold collection — every shade, every story.</p>
        </div>
        <button onClick={startCreate} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple800 text-white font-bold text-sm shadow-lg hover:bg-purple900 transition"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="bg-white rounded-[22px] border border-purple100 p-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple800/30" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" className="w-full pl-11 pr-4 py-3 rounded-full border border-purple100 bg-purple50/50 focus:bg-white focus:border-purple300 focus:outline-none text-sm" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-3 rounded-full border border-purple100 bg-purple50/50 text-sm focus:outline-none focus:border-purple300">
          <option value="">All Categories</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group bg-white rounded-[22px] overflow-hidden border border-purple100 shadow-sm hover:shadow-md transition">
              <div className="relative aspect-[4/3] bg-purple50 overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={e => e.target.style.display = 'none'} /> : <div className="w-full h-full grid place-items-center text-purple300"><Package className="w-8 h-8" /></div>}
                <div className="absolute top-3 left-3 flex gap-2">
                  {p.featured && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple900 text-white text-[10px] font-bold tracking-widest"><Star className="w-3 h-3 fill-current" /> FEATURED</span>}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${Number(p.stock) > 20 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : Number(p.stock) > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'}`}>{p.stock ?? 0} in stock</span>
                </div>
                <div className="absolute inset-0 bg-purple900/0 group-hover:bg-purple900/10 transition" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-purple900 leading-tight line-clamp-1">{p.name}</h3>
                <p className="text-xs text-purple800/50 line-clamp-2 mt-1 min-h-[32px]">{p.description || 'No description'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-bold text-purple900">₦{Number(p.price).toLocaleString()}</p>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple50 border border-purple100 text-purple800 font-semibold">{cats.find(c => String(c.id) === String(p.category_id))?.name || 'Uncategorized'}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => startEdit(p)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border-2 border-purple800 text-purple800 font-bold text-xs hover:bg-purple800 hover:text-white transition"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => del(p.id)} className="px-4 py-2.5 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-[22px] border border-dashed border-purple200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple50 border border-purple100 grid place-items-center mx-auto text-purple400"><Sparkles className="w-6 h-6" /></div>
          <p className="mt-4 font-bold text-purple900">No products found</p>
          <p className="text-sm text-purple800/50">Try a different search or create a new product.</p>
          <button onClick={startCreate} className="mt-4 px-6 py-3 rounded-full bg-purple800 text-white font-bold text-sm">Create Product</button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-purple900/50 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: 420, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 420, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-purple100 px-6 py-5 flex items-center justify-between">
                <h2 className="font-bold text-purple900 text-lg">{edit ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full border border-purple100 grid place-items-center hover:bg-purple50"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={submit} className="p-6 space-y-4">
                <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">NAME</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">PRICE (₦)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm" required /></div>
                  <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">STOCK</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm" /></div>
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-widest text-purple800/60">IMAGE</label>
                  <div className="mt-1 flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-purple200 bg-purple50 hover:bg-purple100 cursor-pointer text-sm font-semibold text-purple800 transition">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploading ? 'Uploading...' : 'Upload file'}
                      <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
                    </label>
                    {form.image && <img src={form.image} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-purple100" onError={e=>e.target.style.display='none'} />}
                  </div>
                  <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://... or upload above" className="mt-2 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm" />
                  <p className="text-[11px] text-purple800/40 mt-1">Upload to cPanel (<code>/uploads/</code>) or paste a URL. File stored on server and shown on client.</p>
                </div>
                <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">CATEGORY</label><select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 bg-white focus:border-purple400 focus:outline-none text-sm"><option value="">No category</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">DESCRIPTION</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm resize-none" /></div>
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-purple50 border border-purple100 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-purple800" /><span className="text-sm font-bold text-purple900">Featured on homepage</span><Star className={`ml-auto w-4 h-4 ${form.featured ? 'text-purple800 fill-current' : 'text-purple300'}`} /></label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-3.5 rounded-full bg-purple800 text-white font-bold hover:bg-purple900 transition">{edit ? 'Update Product' : 'Create Product'}</button>
                  <button type="button" onClick={() => setOpen(false)} className="px-6 py-3.5 rounded-full border-2 border-purple100 font-bold text-purple800 hover:bg-purple50">Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
