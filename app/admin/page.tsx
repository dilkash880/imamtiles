import Link from 'next/link';
import { requireAdmin } from '@/lib/serverAuth';
import { SectionHeading } from '@/components/SectionHeading';
import { ProMaxPanel } from '@/components/ui-pro-max';

export default async function AdminPage() {
  const profile = await requireAdmin();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Admin overview"
        title="Control your tile showroom from one place"
        description={`Hello ${profile.name ?? profile.email}, access product management, customer enquiries, user details, and analytics with admin permissions.`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: 'Products',
            description: 'Manage product inventory, categories, brands, and images.',
            href: '/admin/products',
          },
          {
            title: 'Enquiries',
            description: 'Review tile and granite enquiries, reply, and update status.',
            href: '/admin/enquiries',
          },
          {
            title: 'Customers',
            description: 'View registered customers, saved items, and profile details.',
            href: '/admin/customers',
          },
        ].map((item) => (
          <ProMaxPanel key={item.title} className="group hover:-translate-y-1 transition-transform">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              <Link href={item.href} className="inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Go to {item.title}
              </Link>
            </div>
          </ProMaxPanel>
        ))}
      </div>
    </div>
  );
}
