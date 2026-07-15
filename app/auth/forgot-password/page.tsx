'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/lib/auth';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await requestPasswordReset({ email });
      setSent(true);
    } catch (err: any) {
      setMessage(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <ProMaxPanel>
        <h2 className="text-2xl font-semibold">Reset your password</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Enter your account email and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
            If an account exists for {email}, a reset link has been sent. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border px-4 py-3"
                required
              />
            </label>

            {message && <p className="text-sm text-red-600">{message}</p>}

            <div>
              <ProMaxButton type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </ProMaxButton>
            </div>
          </form>
        )}
      </ProMaxPanel>
    </div>
  );
}
