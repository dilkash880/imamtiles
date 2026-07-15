import { getProductPageData } from '@/lib/admin/products';
import ProductManagement from '@/components/admin/ProductManagement';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const { products, categories, brands } = await getProductPageData();

  return (
    <div className="space-y-6">
      <ProductManagement products={products} categories={categories} brands={brands} />
    </div>
  );
}
