import Link from 'next/link';
import { requireAdmin } from '@/lib/serverAuth';
import { SectionHeading } from '@/components/SectionHeading';
import { ProMaxPanel } from '@/components/ui-pro-max';

// Auth-gated: must never be statically cached/prerendered, even if
// Supabase env vars happen to be unset at build time.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-600 dark:text-indigo-300">Admin</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Dashboard</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Manage products, customer enquiries, users, and analytics.</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Overview', href: '/admin' },
              { label: 'Products', href: '/admin/products' },
              { label: 'Categories', href: '/admin/categories' },
              { label: 'Brands', href: '/admin/brands' },
              { label: 'Enquiries', href: '/admin/enquiries' },
              { label: 'Customers', href: '/admin/customers' },
              { label: 'Analytics', href: '/admin/analytics' },
              { label: 'Profile', href: '/admin/profile' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-sm text-slate-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-slate-200">
            <p className="font-semibold">Admin user</p>
            <p className="mt-2 text-sm">{profile.name ?? profile.email}</p>
          </div>
        </aside>

        <main className="space-y-6">
          <header className="rounded-[1.8rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">Welcome back</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Admin dashboard</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Access role-based management tools for your showroom, products, enquiries, and customers.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/admin/profile" className="rounded-full border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
                  View profile
                </Link>
                <Link href="/auth/logout" className="rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 dark:bg-white dark:text-slate-950">
                  Sign out
                </Link>
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
