'use client';

import { useState } from 'react';
import { updatePassword } from '@/lib/auth';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ password });
      router.push('/auth/login');
    } catch (err: any) {
      setMessage(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <ProMaxPanel>
        <h2 className="text-2xl font-semibold">Set a new password</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-medium">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-2xl border px-4 py-3"
              required
              minLength={6}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-2xl border px-4 py-3"
              required
              minLength={6}
            />
          </label>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <div>
            <ProMaxButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update password'}
            </ProMaxButton>
          </div>
        </form>
      </ProMaxPanel>
    </div>
  );
}
