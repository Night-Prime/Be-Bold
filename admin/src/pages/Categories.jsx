import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi } from '../api/client';
import { Layers, Plus, Pencil, Trash2, X, Tag, Sparkles } from 'lucide-react';

export default function Categories() {
  const [list, setList] = useState([]); const [form, setForm] = useState({ name: '', slug: '', description: '' }); const [edit, setEdit] = useState(null); const [open, setOpen] = useState(false);
  const load = () => categoriesApi.list().then(setList).catch(() => {});
  useEffect(() => { load() }, []);
  const submit = async e => {
    e.preventDefault(); const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
    if (edit) await categoriesApi.update(edit, { ...form, slug }); else await categoriesApi.create({ ...form, slug });
    setForm({ name: '', slug: '', description: '' }); setEdit(null); setOpen(false); load();
  };
  const startEdit = c => { setEdit(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || '' }); setOpen(true); };
  const startCreate = () => { setEdit(null); setForm({ name: '', slug: '', description: '' }); setOpen(true); };
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-purple100 text-[11px] font-bold tracking-[0.16em] text-purple800">{list.length} CATEGORIES</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-purple900 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-purple900 text-white grid place-items-center"><Layers className="w-4 h-4" /></span> Categories</h1>
          <p className="text-sm text-purple800/50 mt-1">Organize your collection with purpose.</p>
        </div>
        <button onClick={startCreate} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple800 text-white font-bold text-sm shadow-lg hover:bg-purple900 transition"><Plus className="w-4 h-4" /> New Category</button>
      </div>

      {list.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(c => (
            <motion.div key={c.id} whileHover={{ y: -3 }} className="bg-white rounded-[22px] p-5 border border-purple100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple800 to-purple500 text-white grid place-items-center"><Tag className="w-4 h-4" /></div>
              <h3 className="mt-4 font-bold text-purple900">{c.name}</h3>
              <p className="text-xs font-mono text-purple800/40">/{c.slug}</p>
              <p className="text-xs text-purple800/50 mt-2 line-clamp-2 min-h-[32px]">{c.description || 'No description'}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => startEdit(c)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full border-2 border-purple800 text-purple800 font-bold text-xs hover:bg-purple800 hover:text-white transition"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={async () => { if (!window.confirm('Delete category?')) return; await categoriesApi.remove(c.id); load(); }} className="px-4 py-2.5 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white rounded-[22px] border border-dashed border-purple200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple50 border border-purple100 grid place-items-center mx-auto text-purple400"><Sparkles className="w-6 h-6" /></div>
          <p className="mt-4 font-bold text-purple900">No categories yet</p>
          <p className="text-sm text-purple800/50">Create your first category to organize products.</p>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-purple900/50 backdrop-blur-sm z-40" />
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center p-4">
              <div className="w-full max-w-[480px] bg-white rounded-[28px] shadow-2xl border border-purple100 overflow-hidden">
                <div className="px-6 py-5 flex items-center justify-between border-b border-purple100">
                  <h2 className="font-bold text-purple900">{edit ? 'Edit Category' : 'New Category'}</h2>
                  <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full border border-purple100 grid place-items-center hover:bg-purple50"><X className="w-4 h-4" /></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                  <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">NAME</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm" required /></div>
                  <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">SLUG</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm font-mono" /></div>
                  <div><label className="text-[11px] font-bold tracking-widest text-purple800/60">DESCRIPTION</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-purple100 focus:border-purple400 focus:outline-none text-sm resize-none" /></div>
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 py-3.5 rounded-full bg-purple800 text-white font-bold hover:bg-purple900 transition">{edit ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => setOpen(false)} className="px-6 py-3.5 rounded-full border-2 border-purple100 font-bold text-purple800 hover:bg-purple50">Cancel</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
