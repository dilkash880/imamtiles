'use client';

import { useMemo, useState } from 'react';
import type { AdminRole, AdminUser } from '@/lib/admin/users';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

type UserManagementProps = {
  users: AdminUser[];
  roles: AdminRole[];
};

export default function UserManagement({ users, roles }: UserManagementProps) {
  const [items, setItems] = useState<AdminUser[]>(users);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return items.filter((user) => {
      const searchTerm = `${user.name ?? ''} ${user.email ?? ''} ${user.phone ?? ''}`.toLowerCase();
      const matchesSearch = searchTerm.includes(search.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role_name === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [items, search, filterRole]);

  async function refreshUsers() {
    setLoading(true);
    setMessage(null);

    try {
      const query = new URLSearchParams();
      if (filterRole !== 'all') query.set('role', filterRole);
      if (search.trim()) query.set('search', search.trim());

      const response = await fetch(`/api/admin/users?${query.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Unable to refresh users.');
        return;
      }
      setItems(data.users ?? []);
    } catch (error: any) {
      setMessage(error?.message || 'Unable to refresh users.');
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(user: AdminUser, roleId: number) {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: roleId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to update user role.');
        return;
      }

      setItems((current) =>
        current.map((item) => (item.id === user.id ? { ...item, role_id: data.user.role_id, role_name: data.user.role_name } : item))
      );
      setMessage('User role updated successfully.');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to update user role.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProMaxPanel className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">User management</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Manage registered showroom customers and roles</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Search customers, update roles, and review enquiry activity from one interface.</p>
          </div>
          <ProMaxButton type="button" variant="secondary" onClick={refreshUsers}>Refresh</ProMaxButton>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
            <span className="block text-slate-500 dark:text-slate-400">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email or phone"
              className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            />
          </label>
          <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
            <span className="block text-slate-500 dark:text-slate-400">Role</span>
            <select
              value={filterRole}
              onChange={(event) => setFilterRole(event.target.value)}
              className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            >
              <option value="all">all</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </label>
          {message && <div className="rounded-2xl border border-rose-200/80 bg-rose-50/70 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-900/30 dark:text-rose-200">{message}</div>}
        </div>
      </ProMaxPanel>

      <ProMaxPanel>
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/70 dark:border-white/10">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Enquiries</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-200/70 dark:border-white/10">
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{user.name ?? 'Unnamed'}</td>
                  <td className="px-4 py-4">{user.email ?? '—'}</td>
                  <td className="px-4 py-4">{user.phone ?? '—'}</td>
                  <td className="px-4 py-4 capitalize">{user.role_name ?? 'customer'}</td>
                  <td className="px-4 py-4">{user.enquiry_count}</td>
                  <td className="px-4 py-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={user.role_name ?? 'customer'}
                        onChange={(event) => {
                          const selectedRole = event.target.value;
                          const role = roles.find((item) => item.name === selectedRole);
                          if (role) updateRole(user, role.id);
                        }}
                        className="rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                      </select>
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
