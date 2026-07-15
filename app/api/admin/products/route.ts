import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import { authorizeAdmin } from '@/lib/admin/authorize';

function normalizeProduct(product: any) {
  const imageUrl = (product.product_images ?? []).find((image: any) => image.is_primary)?.storage_path ??
    product.product_images?.[0]?.storage_path ?? null;

  return {
    ...product,
    category_name: product.categories?.name ?? null,
    brand_name: product.brands?.name ?? null,
    image_url: imageUrl,
  };
}

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select(
      `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at,
       categories(name), brands(name), product_images(storage_path, is_primary)`
    )
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data ?? []).map((product: any) => {
    const imageUrl = (product.product_images ?? []).find((image: any) => image.is_primary)?.storage_path ?? product.product_images?.[0]?.storage_path ?? null;
    return {
      ...product,
      category_name: product.categories?.name ?? null,
      brand_name: product.brands?.name ?? null,
      image_url: imageUrl,
    };
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await req.json();
  const {
    name,
    category_id,
    brand_id,
    size,
    finish,
    color,
    material,
    description,
    price,
    stock,
    featured,
    status,
    image_urls,
  } = payload;

  const { data: createdProducts, error: productError } = await supabaseAdmin.from('products').insert({
    name,
    category_id,
    brand_id,
    size,
    finish,
    color,
    material,
    description,
    price,
    stock,
    featured,
    status,
  }).select(
    `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at, categories(name), brands(name), product_images(storage_path, is_primary)`
  ).single();

  if (productError || !createdProducts) {
    return NextResponse.json({ error: productError?.message ?? 'Failed to create product' }, { status: 500 });
  }

  const product = normalizeProduct(createdProducts);

  if (Array.isArray(image_urls) && image_urls.length > 0) {
    await supabaseAdmin.from('product_images').insert(
      image_urls.map((url: string, index: number) => ({
        product_id: product.id,
        storage_path: url,
        is_primary: index === 0,
      }))
    );

    const { data: refreshedProduct } = await supabaseAdmin.from('products')
      .select(
        `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at, categories(name), brands(name), product_images(storage_path, is_primary)`
      )
      .eq('id', product.id)
      .single();

    if (refreshedProduct) {
      return NextResponse.json({ product: normalizeProduct(refreshedProduct) });
    }
  }

  return NextResponse.json({ product });
}
