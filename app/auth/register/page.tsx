'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/auth';
import { ProMaxButton } from '@/components/ui-pro-max';
import { ProMaxPanel } from '@/components/ui-pro-max';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await registerUser({ email, password, name, phone });
      setMessage('Registration successful. Please check your email to confirm (if required).');
    } catch (err: any) {
      setMessage(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <ProMaxPanel>
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <form onSubmit={handleRegister} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border px-4 py-3" />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border px-4 py-3" />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-2xl border px-4 py-3" />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-2xl border px-4 py-3" />
          </label>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <div>
            <ProMaxButton type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </ProMaxButton>
          </div>
        </form>
      </ProMaxPanel>
    </div>
  );
}
