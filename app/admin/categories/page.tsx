import CatalogManagement from '@/components/admin/CatalogManagement';
import { getAdminCategories } from '@/lib/admin/catalog';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <CatalogManagement
        items={categories}
        endpoint="/api/admin/categories"
        title="Category management"
        description="Manage showroom categories and product classification."
        itemLabel="category"
      />
    </div>
  );
}
