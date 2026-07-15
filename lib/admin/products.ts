import supabaseAdmin from '../supabaseServer';

export type AdminProduct = {
  id: number;
  name: string;
  category_id: number | null;
  category_name?: string | null;
  brand_id: number | null;
  brand_name?: string | null;
  size?: string | null;
  finish?: string | null;
  color?: string | null;
  material?: string | null;
  description?: string | null;
  price?: number | null;
  stock?: number | null;
  featured: boolean;
  status?: string | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminCategory = {
  id: number;
  name: string;
};

export type AdminBrand = {
  id: number;
  name: string;
};

export async function getAdminProducts() {
  if (!supabaseAdmin) return [] as AdminProduct[];

  const { data, error } = await supabaseAdmin
    .from('products')
    .select(
      `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at,
       categories(name), brands(name), product_images(storage_path, is_primary)`
    )
    .order('created_at', { ascending: false });

  if (error || !data) return [] as AdminProduct[];

  return data.map((product: any) => {
    const imageUrl = (product.product_images ?? []).find((image: any) => image.is_primary)?.storage_path ??
      product.product_images?.[0]?.storage_path ?? null;

    return {
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      category_name: product.categories?.name ?? null,
      brand_id: product.brand_id,
      brand_name: product.brands?.name ?? null,
      size: product.size,
      finish: product.finish,
      color: product.color,
      material: product.material,
      description: product.description,
      price: product.price,
      stock: product.stock,
      featured: product.featured,
      status: product.status,
      image_url: imageUrl,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  });
}

export async function getAdminCategories() {
  if (!supabaseAdmin) return [] as AdminCategory[];
  const { data } = await supabaseAdmin.from('categories').select('id, name').order('name');
  return data ?? [];
}

export async function getAdminBrands() {
  if (!supabaseAdmin) return [] as AdminBrand[];
  const { data } = await supabaseAdmin.from('brands').select('id, name').order('name');
  return data ?? [];
}

export async function getProductPageData() {
  const [products, categories, brands] = await Promise.all([getAdminProducts(), getAdminCategories(), getAdminBrands()]);
  return { products, categories, brands };
}
