'use client';

import { useMemo, useState } from 'react';
import type { AdminBrand, AdminCategory, AdminProduct } from '@/lib/admin/products';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

type ProductFormState = {
  id?: number;
  name: string;
  category_id: number | null;
  brand_id: number | null;
  size: string;
  finish: string;
  color: string;
  material: string;
  description: string;
  price: string;
  stock: string;
  featured: boolean;
  status: string;
  image_urls: string;
};

type ProductManagementProps = {
  products: AdminProduct[];
  categories: AdminCategory[];
  brands: AdminBrand[];
};

const defaultFormState: ProductFormState = {
  name: '',
  category_id: null,
  brand_id: null,
  size: '',
  finish: '',
  color: '',
  material: '',
  description: '',
  price: '',
  stock: '',
  featured: false,
  status: 'active',
  image_urls: '',
};

const statusOptions = ['active', 'inactive', 'pre-order'];

function buildFormState(product?: AdminProduct): ProductFormState {
  return {
    id: product?.id,
    name: product?.name ?? '',
    category_id: product?.category_id ?? null,
    brand_id: product?.brand_id ?? null,
    size: product?.size ?? '',
    finish: product?.finish ?? '',
    color: product?.color ?? '',
    material: product?.material ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    featured: product?.featured ?? false,
    status: product?.status ?? 'active',
    image_urls: product?.image_url ? product.image_url : '',
  };
}

export default function ProductManagement({ products, categories, brands }: ProductManagementProps) {
  const [items, setItems] = useState<AdminProduct[]>(products);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [formState, setFormState] = useState<ProductFormState>(defaultFormState);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return items.filter((product) => {
      const keyword = `${product.name} ${product.category_name ?? ''} ${product.brand_name ?? ''} ${product.size ?? ''} ${product.finish ?? ''}`.toLowerCase();
      const searchMatches = keyword.includes(search.toLowerCase());
      const categoryMatches = selectedCategory === 'All' || product.category_name === selectedCategory;
      const brandMatches = selectedBrand === 'All' || product.brand_name === selectedBrand;
      const statusMatches = selectedStatus === 'All' || product.status === selectedStatus;
      return searchMatches && categoryMatches && brandMatches && statusMatches;
    });
  }, [items, search, selectedCategory, selectedBrand, selectedStatus]);

  async function syncProducts() {
    try {
      const response = await fetch('/api/admin/products', { credentials: 'include' });
      if (!response.ok) return;
      const { products: refreshed } = await response.json();
      if (Array.isArray(refreshed)) setItems(refreshed);
    } catch (error) {
      console.warn(error);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name: formState.name,
      category_id: formState.category_id,
      brand_id: formState.brand_id,
      size: formState.size,
      finish: formState.finish,
      color: formState.color,
      material: formState.material,
      description: formState.description,
      price: Number(formState.price) || 0,
      stock: Number(formState.stock) || 0,
      featured: formState.featured,
      status: formState.status,
      image_urls: formState.image_urls.split(',').map((url) => url.trim()).filter(Boolean),
    };

    try {
      const endpoint = formState.id ? `/api/admin/products/${formState.id}` : '/api/admin/products';
      const method = formState.id ? 'PATCH' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to save product');
        return;
      }

      await syncProducts();
      setFormState(defaultFormState);
      setEditing(false);
      setMessage(formState.id ? 'Product updated successfully.' : 'Product created successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(product: AdminProduct) {
    setFormState(buildFormState(product));
    setEditing(true);
    setMessage(null);
  }

  async function handleDelete(productId: number) {
    if (!window.confirm('Delete this product permanently?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to delete product');
        return;
      }
      await syncProducts();
      setMessage('Product deleted successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormState(defaultFormState);
    setEditing(false);
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <ProMaxPanel className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Product management</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Manage your showroom inventory</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Create products, update stock, and publish new tile collections.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ProMaxButton type="button" variant="secondary" onClick={syncProducts}>Refresh</ProMaxButton>
              <ProMaxButton onClick={() => { resetForm(); setEditing(true); }} variant="accent">Add product</ProMaxButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="block text-slate-500 dark:text-slate-400">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white"
              />
            </label>
            <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="block text-slate-500 dark:text-slate-400">Category</span>
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white">
                <option>All</option>
                {categories.map((category) => (<option key={category.id}>{category.name}</option>))}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="block text-slate-500 dark:text-slate-400">Brand</span>
              <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)} className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white">
                <option>All</option>
                {brands.map((brand) => (<option key={brand.id}>{brand.name}</option>))}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="block text-slate-500 dark:text-slate-400">Status</span>
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white">
                <option>All</option>
                {statusOptions.map((status) => (<option key={status}>{status}</option>))}
              </select>
            </label>
          </div>
        </ProMaxPanel>

        <ProMaxPanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Inventory summary</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{items.length} products</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
              <p className="text-slate-500 dark:text-slate-300">Today</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Live</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Featured products</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{items.filter((item) => item.featured).length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Out of stock</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{items.filter((item) => item.stock === 0).length}</p>
            </div>
          </div>
        </ProMaxPanel>
      </div>

      {editing && (
        <ProMaxPanel>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{formState.id ? 'Edit product' : 'New product'}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fill in product details and save to update inventory.</p>
            </div>
            <ProMaxButton variant="secondary" onClick={resetForm}>Cancel</ProMaxButton>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Product name</span>
              <input value={formState.name} onChange={(event) => setFormState({ ...formState, name: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Category</span>
              <select value={formState.category_id ?? ''} onChange={(event) => setFormState({ ...formState, category_id: event.target.value ? Number(event.target.value) : null })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                <option value="">Select category</option>
                {categories.map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Brand</span>
              <select value={formState.brand_id ?? ''} onChange={(event) => setFormState({ ...formState, brand_id: event.target.value ? Number(event.target.value) : null })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                <option value="">Select brand</option>
                {brands.map((brand) => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
              </select>
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Price</span>
              <input type="number" step="0.01" value={formState.price} onChange={(event) => setFormState({ ...formState, price: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Stock</span>
              <input type="number" value={formState.stock} onChange={(event) => setFormState({ ...formState, stock: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Size</span>
              <input value={formState.size} onChange={(event) => setFormState({ ...formState, size: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Finish</span>
              <input value={formState.finish} onChange={(event) => setFormState({ ...formState, finish: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Color</span>
              <input value={formState.color} onChange={(event) => setFormState({ ...formState, color: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Material</span>
              <input value={formState.material} onChange={(event) => setFormState({ ...formState, material: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300 lg:col-span-2">
              <span className="mb-2 block font-medium">Description</span>
              <textarea value={formState.description} onChange={(event) => setFormState({ ...formState, description: event.target.value })} rows={4} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Status</span>
              <select value={formState.status} onChange={(event) => setFormState({ ...formState, status: event.target.value })} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
                {statusOptions.map((status) => (<option key={status} value={status}>{status}</option>))}
              </select>
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300">
              <span className="mb-2 block font-medium">Featured</span>
              <input type="checkbox" checked={formState.featured} onChange={(event) => setFormState({ ...formState, featured: event.target.checked })} className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            </label>
            <label className="block text-sm text-slate-700 dark:text-slate-300 lg:col-span-2">
              <span className="mb-2 block font-medium">Image URLs</span>
              <textarea value={formState.image_urls} onChange={(event) => setFormState({ ...formState, image_urls: event.target.value })} rows={3} placeholder="Enter comma-separated URLs" className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
            </label>
            {message && <p className="text-sm text-red-600 lg:col-span-2">{message}</p>}
            <div className="lg:col-span-2">
              <ProMaxButton type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving…' : formState.id ? 'Save changes' : 'Create product'}
              </ProMaxButton>
            </div>
          </form>
        </ProMaxPanel>
      )}

      <ProMaxPanel>
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/70 dark:border-white/10">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-slate-200/70 dark:border-white/10">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-2xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">No image</div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{product.size ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{product.category_name ?? '—'}</td>
                  <td className="px-4 py-4">{product.brand_name ?? '—'}</td>
                  <td className="px-4 py-4">{product.stock ?? '—'}</td>
                  <td className="px-4 py-4">{product.price != null ? `₹${product.price}` : '—'}</td>
                  <td className="px-4 py-4">{product.status}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleEdit(product)} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(product.id)} className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProMaxPanel>
    </div>
  );
}
