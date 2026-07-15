'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/auth';
import { ProMaxButton } from '@/components/ui-pro-max';
import { ProMaxPanel } from '@/components/ui-pro-max';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await loginUser({ email, password });
      // redirect after login
      router.push('/');
    } catch (err: any) {
      setMessage(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <ProMaxPanel>
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border px-4 py-3" />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-2xl border px-4 py-3" />
          </label>

          <div className="text-right text-sm">
            <Link href="/auth/forgot-password" className="text-indigo-600 hover:underline dark:text-indigo-300">
              Forgot password?
            </Link>
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <div>
            <ProMaxButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </ProMaxButton>
          </div>
        </form>
      </ProMaxPanel>
    </div>
  );
}
