import { SectionHeading } from '@/components/SectionHeading';
import UserManagement from '@/components/admin/UserManagement';
import { getAdminUsersPageData } from '@/lib/admin/users';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const { users, roles } = await getAdminUsersPageData();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Customers"
        title="Customer management"
        description="View registered customers, manage roles, and track enquiry history from the admin workspace."
      />
      <UserManagement users={users} roles={roles} />
    </div>
  );
}
