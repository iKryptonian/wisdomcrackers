import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { products as hardcodedProducts } from '../data/products';
import { Product } from '../types';
import { Plus, Pencil, Trash2, Upload, X, Check, Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ADMIN_PASSWORD = 'sktadmin';

const emptyForm = {
  name: '', content: '', image: '',
  actual_price: '', price: '', unit: 'Box', category: '',
};

const AdminPage: React.FC = () => {
  const { refreshProducts, setCurrentPage } = useApp();

  const [authed, setAuthed]         = useState(false);
  const [password, setPassword]     = useState('');
  const [pwError, setPwError]       = useState('');

  const [products, setProducts]     = useState<Product[]>([]);
  const [dbOnline, setDbOnline]     = useState(false);
  const [dbError, setDbError] = useState('');
  const [loading, setLoading]       = useState(true);

  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [form, setForm]             = useState({ ...emptyForm });
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState<number | null>(null);

  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading]   = useState(false);

  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('');
  const fileRef                     = useRef<HTMLInputElement>(null);


  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError(''); }
    else setPwError('Incorrect password');
  }; 

  useEffect(() => { if (authed) loadProducts(); }, [authed]);

  const loadProducts = async () => {
    setLoading(true);
    setDbError('');
    try {
        const { data, error } = await supabase.from('products').select('*').order('id');
        if (error) {
          setDbError('Database error: ' + error.message);
          setProducts([]);
          setDbOnline(false);
        } else if (!data || data.length === 0) {
          setDbError('No products found in database. Add your first product using the "Add Product" button.');
          setProducts([]);
          setDbOnline(false);
        } else {
          setProducts(data.map(p => ({
            id: p.id, name: p.name, content: p.content ?? '',
            image: p.image ?? '', actualPrice: p.actual_price,
            price: p.price, unit: p.unit ?? '', category: p.category ?? '',
          })));
          setDbOnline(true);
          setDbError('');
        }
    } catch (e: any) {
      setDbError('Could not connect to database: ' + e.message);
      setProducts([]);
      setDbOnline(false);
    }
    setLoading(false);
 };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return form.image;
    setUploading(true);
    const ext  = imageFile.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile);
    setUploading(false);
    if (error) throw error;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const openAdd = () => {
    setEditId(null); setForm({ ...emptyForm });
    setImageFile(null); setImagePreview(''); setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, content: p.content, image: p.image,
      actual_price: String(p.actualPrice), price: String(p.price),
      unit: p.unit, category: p.category });
    setImageFile(null); setImagePreview(p.image); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.actual_price) return;
    setSaving(true);
    try {
      const imageUrl = await uploadImage();
      const payload = {
        name: form.name, content: form.content, image: imageUrl,
        actual_price: Number(form.actual_price), price: Number(form.price),
        unit: form.unit, category: form.category,
      };
      if (editId !== null) {
        await supabase.from('products').update(payload).eq('id', editId);
      } else {
        await supabase.from('products').insert(payload);
      }
      setShowForm(false);
      await loadProducts();
      refreshProducts();
      window.location.hash = '';
      window.location.reload();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setDeleting(null);
    await loadProducts();
    await refreshProducts();
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat ? p.category === filterCat : true;
    return matchSearch && matchCat;
  });

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <Lock className="w-10 h-10 text-red-700" />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Enter admin password"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
        />
        {pwError && <p className="text-red-500 text-xs mb-3">{pwError}</p>}
        <button onClick={handleLogin}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition">
          Login
        </button>
      </div>
    </div>
  );

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-red-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage('home')}
            className="p-1 hover:bg-red-700 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-red-200">
              {dbOnline ? '🟢 Supabase DB active' : '🟡 Showing hardcoded data — DB empty'}
            </p>
          </div>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 bg-white text-red-700 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-50">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 flex flex-wrap gap-2 bg-white border-b">
        <input type="text" placeholder="Search products..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 flex-1 min-w-[180px]"
        />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs text-gray-400 self-center">{filtered.length} products</span>
      </div>

      {/* Product grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
            <div className="col-span-full text-center py-20">
                <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading products from database...</p>
            </div>
        ) : dbError ? (
            <div className="col-span-full text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-red-600 font-semibold mb-2">⚠️ {dbError}</p>
                    <button
                        onClick={loadProducts}
                        className="mt-3 bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        ) : filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-40 bg-gray-100">
              <img src={p.image} alt={p.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
              />
              <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                {p.category}
              </span>
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm text-gray-800 leading-tight">{p.name}</p>
              <p className="text-xs text-gray-400 mb-2">{p.content} · {p.unit}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs line-through text-gray-400">₹{p.actualPrice}</span>
                <span className="text-sm font-bold text-red-700">₹{p.price}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1 border border-gray-200 rounded-lg py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  className="flex-1 flex items-center justify-center gap-1 border border-red-200 rounded-lg py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <Trash2 className="w-3 h-3" />
                  {deleting === p.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-bold text-gray-800">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="px-5 py-4 space-y-3">

              {/* Image upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Image</label>
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-red-300 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <input
                  type="text" value={form.image}
                  onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }}
                  placeholder="Or paste image URL"
                  className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              {[
                { label: 'Product Name *',      field: 'name',         placeholder: '7CM Electric Sparklers' },
                { label: 'Content',             field: 'content',      placeholder: '1 Box = 10 Pcs' },
                { label: 'Category',            field: 'category',     placeholder: 'Sparklers' },
                { label: 'Unit',                field: 'unit',         placeholder: 'Box' },
                { label: 'Actual Price (MRP) *',field: 'actual_price', placeholder: '100', type: 'number' },
                { label: 'Selling Price *',     field: 'price',        placeholder: '20',  type: 'number' },
              ].map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input
                    type={type ?? 'text'}
                    value={(form as any)[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              ))}

              {!dbOnline && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                  ⚠️ DB is empty. Adding this product will save to Supabase and activate DB mode.
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || uploading}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl py-2.5 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {uploading ? 'Uploading...' : saving ? 'Saving...' : editId ? 'Update' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 