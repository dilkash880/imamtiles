import { createClient } from './supabase/server';

export type ProductAvailability = 'In Stock' | 'Limited' | 'Out of Stock' | 'Pre-order';

export type PublicProduct = {
  id: number;
  name: string;
  category: string;
  categoryId: number | null;
  brand: string | null;
  size: string | null;
  finish: string | null;
  color: string | null;
  material: string | null;
  price: number | null;
  description: string | null;
  availability: ProductAvailability;
  image: string | null;
  images: string[];
  featured: boolean;
};

const PRODUCT_SELECT = `id, name, category_id, brand_id, size, finish, color, material, price, description, stock, featured, status, created_at,
   categories(name), brands(name), product_images(storage_path, is_primary)`;

function deriveAvailability(status: string | null, stock: number | null): ProductAvailability {
  if (status === 'pre-order') return 'Pre-order';
  const quantity = stock ?? 0;
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= 5) return 'Limited';
  return 'In Stock';
}

type ProductImageRow = { storage_path: string; is_primary: boolean };

function mapProduct(row: any): PublicProduct {
  const productImages: ProductImageRow[] = [...(row.product_images ?? [])].sort(
    (a: ProductImageRow, b: ProductImageRow) => Number(b.is_primary) - Number(a.is_primary)
  );
  const images = productImages.map((img) => img.storage_path);

  return {
    id: row.id,
    name: row.name,
    category: row.categories?.name ?? 'Uncategorized',
    categoryId: row.category_id ?? null,
    brand: row.brands?.name ?? null,
    size: row.size ?? null,
    finish: row.finish ?? null,
    color: row.color ?? null,
    material: row.material ?? null,
    price: row.price ?? null,
    description: row.description ?? null,
    availability: deriveAvailability(row.status, row.stock),
    image: images[0] ?? null,
    images,
    featured: Boolean(row.featured),
  };
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
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
    .select(`product_id, products(${PRODUCT_SELECT})`)
    .eq('user_id', userId);

  if (error || !data) return [];

  return data
    .map((row: any) => row.products)
    .filter((product: any) => product && product.status !== 'inactive')
    .map(mapProduct);
}

export async function getProductById(id: number): Promise<PublicProduct | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .neq('status', 'inactive')
    .maybeSingle();

  if (error || !data) return null;

  return mapProduct(data);
}

export async function getRelatedProducts(
  categoryId: number | null,
  excludeId: number,
  limit = 4
): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase || !categoryId) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .neq('status', 'inactive')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(mapProduct);
}

export async function getSimilarProducts(
  product: Pick<PublicProduct, 'material' | 'finish' | 'color'>,
  excludeIds: number[],
  limit = 4
): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const orParts = [
    product.material ? `material.eq.${product.material}` : null,
    product.finish ? `finish.eq.${product.finish}` : null,
    product.color ? `color.eq.${product.color}` : null,
  ].filter((part): part is string => Boolean(part));

  if (orParts.length === 0) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .or(orParts.join(','))
    .neq('status', 'inactive')
    .limit(limit + excludeIds.length);

  if (error || !data) return [];

  return data
    .map(mapProduct)
    .filter((item) => !excludeIds.includes(item.id))
    .slice(0, limit);
}

export async function getAlsoViewedProducts(excludeIds: number[], limit = 4): Promise<PublicProduct[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: featuredData } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('featured', true)
    .neq('status', 'inactive')
    .order('created_at', { ascending: false })
    .limit(limit + excludeIds.length);

  const featured = (featuredData ?? []).map(mapProduct).filter((item) => !excludeIds.includes(item.id));
  if (featured.length >= limit) return featured.slice(0, limit);

  const { data: fallbackData } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .neq('status', 'inactive')
    .order('created_at', { ascending: false })
    .limit(limit + excludeIds.length);

  const extra = (fallbackData ?? [])
    .map(mapProduct)
    .filter((item) => !excludeIds.includes(item.id) && !featured.some((f) => f.id === item.id));

  return [...featured, ...extra].slice(0, limit);
}

export function getProductFilterOptions(products: PublicProduct[]) {
  const categories = ['All', ...Array.from(new Set(products.map((product) => product.category))).sort()];
  const sizes = ['All', ...Array.from(new Set(products.map((product) => product.size).filter((value): value is string => Boolean(value))))];
  const finishes = ['All', ...Array.from(new Set(products.map((product) => product.finish).filter((value): value is string => Boolean(value))))];
  const availabilityOptions: Array<'All' | ProductAvailability> = ['All', 'In Stock', 'Limited', 'Pre-order', 'Out of Stock'];

  return { categories, sizes, finishes, availabilityOptions };
}
