'use client';

import { useState } from 'react';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

type CatalogItem = {
  id: number;
  name: string;
};

type CatalogManagementProps = {
  items: CatalogItem[];
  endpoint: string;
  title: string;
  description: string;
  itemLabel: string;
};

export default function CatalogManagement({ items, endpoint, title, description, itemLabel }: CatalogManagementProps) {
  const [entries, setEntries] = useState<CatalogItem[]>(items);
  const [editedItem, setEditedItem] = useState<CatalogItem | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshList() {
    try {
      const response = await fetch(endpoint, { credentials: 'include' });
      if (!response.ok) throw new Error('Unable to refresh list');
      const data = await response.json();
      setEntries(data.categories ?? data.brands ?? []);
    } catch (error) {
      console.warn(error);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setMessage(`Please enter a ${itemLabel} name.`);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const url = editedItem ? `${endpoint}/${editedItem.id}` : endpoint;
      const method = editedItem ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || `Failed to save ${itemLabel}.`);
        return;
      }

      setName('');
      setEditedItem(null);
      setMessage(`${itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} saved successfully.`);
      await refreshList();
    } catch (error: any) {
      setMessage(error?.message || `Failed to save ${itemLabel}.`);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(item: CatalogItem) {
    setEditedItem(item);
    setName(item.name);
    setMessage(null);
  }

  async function handleDelete(itemId: number) {
    if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${endpoint}/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || `Failed to delete ${itemLabel}.`);
        return;
      }
      setMessage(`${itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} deleted successfully.`);
      await refreshList();
    } catch (error: any) {
      setMessage(error?.message || `Failed to delete ${itemLabel}.`);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditedItem(null);
    setName('');
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <ProMaxPanel className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">{title}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{description}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ProMaxButton variant="secondary" type="button" onClick={refreshList}>Refresh</ProMaxButton>
            <ProMaxButton type="button" onClick={() => { handleCancel(); setName(''); }}>New {itemLabel}</ProMaxButton>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block text-sm text-slate-700 dark:text-slate-300">
            <span className="mb-2 block font-medium">{itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder={`Enter ${itemLabel} name`} className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white" />
          </label>
          <div className="flex items-end gap-3">
            {editedItem && (
              <button type="button" onClick={handleCancel} className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
                Cancel
              </button>
            )}
            <ProMaxButton type="submit" disabled={loading}>
              {loading ? 'Saving…' : editedItem ? 'Save changes' : `Add ${itemLabel}`}
            </ProMaxButton>
          </div>
        </form>
        {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
      </ProMaxPanel>

      <ProMaxPanel>
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/70 dark:border-white/10">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item) => (
                <tr key={item.id} className="border-t border-slate-200/70 dark:border-white/10">
                  <td className="px-4 py-4 text-slate-900 dark:text-white">{item.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleEdit(item)} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300">
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
