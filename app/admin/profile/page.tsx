import { SectionHeading } from '@/components/SectionHeading';
import AdminProfileEditor from '@/components/admin/AdminProfileEditor';
import { getAdminProfile } from '@/lib/admin/profile';
import { requireAdmin } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  await requireAdmin();
  const profile = await getAdminProfile();

  if (!profile) {
    return (
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Profile"
          title="Your administrator profile"
          description="Manage your account details and update contact information from the admin dashboard."
        />
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-6 text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
          Unable to load profile information. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Profile"
        title="Your administrator profile"
        description="Manage your account details and update contact information from the admin dashboard."
      />
      <AdminProfileEditor profile={profile} />
    </div>
  );
}
