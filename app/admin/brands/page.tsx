import CatalogManagement from '@/components/admin/CatalogManagement';
import { getAdminBrands } from '@/lib/admin/catalog';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  const brands = await getAdminBrands();

  return (
    <div className="space-y-6">
      <CatalogManagement
        items={brands}
        endpoint="/api/admin/brands"
        title="Brand management"
        description="Manage showroom brands and supplier collections."
        itemLabel="brand"
      />
    </div>
  );
}
