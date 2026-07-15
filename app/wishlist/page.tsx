import { requireCustomer } from '@/lib/serverAuth';
import { getWishlistProducts } from '@/lib/publicProducts';
import { SectionHeading } from '@/components/SectionHeading';
import { WishlistGrid } from '@/components/WishlistGrid';

// Auth-gated: must never be statically prerendered, even if Supabase env
// vars happen to be unset at build time.
export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const profile = await requireCustomer();
  const products = await getWishlistProducts(profile.id);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Saved for later"
        title="My wishlist"
        description="Products you've saved for quick reference. Tap the heart again to remove an item."
      />
      <WishlistGrid initialProducts={products} />
    </div>
  );
}
