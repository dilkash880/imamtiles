'use client';

import { useMemo, useState } from 'react';
import type { AdminProfile } from '@/lib/admin/profile';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

type AdminProfileEditorProps = {
  profile: AdminProfile;
};

export default function AdminProfileEditor({ profile }: AdminProfileEditorProps) {
  const [name, setName] = useState(profile.name ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const profileSummary = useMemo(() => {
    return [
      profile.email ? `Email: ${profile.email}` : null,
      profile.role_id === 1 ? 'Role: Admin' : 'Role: Customer',
      profile.created_at ? `Member since ${new Date(profile.created_at).toLocaleDateString()}` : null,
    ]
      .filter(Boolean)
      .join(' · ');
  }, [profile.email, profile.role_id, profile.created_at]);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, name: name.trim() || null, phone: phone.trim() || null }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Unable to save profile.');
        return;
      }
      setMessage('Profile updated successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProMaxPanel className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Administrator profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Manage your account information</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Update your name, phone, and account overview without leaving the admin dashboard.</p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-slate-950/60">
          <p className="text-sm text-slate-500 dark:text-slate-400">{profileSummary}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
            <span className="block text-slate-500 dark:text-slate-400">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your display name"
              className="mt-3 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            />
          </label>
          <label className="block rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-950/70 dark:text-white">
            <span className="block text-slate-500 dark:text-slate-400">Phone</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Office or mobile number"
              className="mt-3 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            />
          </label>
        </div>

        {message ? (
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
            {message}
          </div>
        ) : null}

        <div className="flex justify-end">
          <ProMaxButton type="button" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </ProMaxButton>
        </div>
      </ProMaxPanel>
    </div>
  );
}
