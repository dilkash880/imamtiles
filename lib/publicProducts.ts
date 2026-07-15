import { createClient } from './supabase/server';

export type ProductAvailability = 'In Stock' | 'Limited' | 'Out of Stock' | 'Pre-order';

export type PublicProduct = {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  size: string | null;
  finish: string | null;
  color: string | null;
  price: number | null;
  description: string | null;
  availability: ProductAvailability;
  image: string | null;
  featured: boolean;
};

function deriveAvailability(status: string | null, stock: number | null): ProductAvailability {
  if (status === 'pre-order') return 'Pre-order';
  const quantity = stock ?? 0;
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= 5) return 'Limited';
  return 'In Stock';
}

function mapProduct(row: any): PublicProduct {
  const image =
    (row.product_images ?? []).find((img: any) => img.is_primary)?.storage_path ??
    row.product_images?.[0]?.storage_path ??
    null;

  return {
    id: row.id,
    name: row.name,
    category: row.categories?.name ?? 'Uncategorized',
    brand: row.brands?.name ?? null,
    size: row.size ?? null,
    finish: row.finish ?? null,
    color: row.color ?? null,
    price: row.price ?? null,
    description: row.description ?? null,
    availability: deriveAvailability(row.status, row.stock),
    image,
    featured: Boolean(row.featured),
  };
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(
      `id, name, size, finish, color, price, description, stock, featured, status, created_at,
       categories(name), brands(name), product_images(storage_path, is_primary)`
    )
    .neq('status', 'inactive')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map(mapProduct);
}

export async function getWishlistProducts(userId: string): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('wishlists')
    .select(
      `product_id, products(
        id, name, size, finish, color, price, description, stock, featured, status, created_at,
        categories(name), brands(name), product_images(storage_path, is_primary)
      )`
    )
    .eq('user_id', userId);

  if (error || !data) return [];

  return data
    .map((row: any) => row.products)
    .filter((product: any) => product && product.status !== 'inactive')
    .map(mapProduct);
}

export function getProductFilterOptions(products: PublicProduct[]) {
  const categories = ['All', ...Array.from(new Set(products.map((product) => product.category))).sort()];
  const sizes = ['All', ...Array.from(new Set(products.map((product) => product.size).filter((value): value is string => Boolean(value))))];
  const finishes = ['All', ...Array.from(new Set(products.map((product) => product.finish).filter((value): value is string => Boolean(value))))];
  const availabilityOptions: Array<'All' | ProductAvailability> = ['All', 'In Stock', 'Limited', 'Pre-order', 'Out of Stock'];

  return { categories, sizes, finishes, availabilityOptions };
}
