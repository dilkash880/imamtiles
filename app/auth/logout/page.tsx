'use client';

import { useEffect } from 'react';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await logoutUser();
      } catch (e) {
        // ignore
      } finally {
        router.push('/');
      }
    })();
  }, [router]);

  return <div className="mx-auto max-w-md">Signing out…</div>;
}
