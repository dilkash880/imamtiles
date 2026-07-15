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

export async function PATCH(req: Request, context: { params: unknown }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = (await Promise.resolve(context.params)) as { productId: string };
  const productId = Number(params.productId);
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

  const { data: updatedProducts, error: productError } = await supabaseAdmin.from('products').update({
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
  }).eq('id', productId).select(
    `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at, categories(name), brands(name), product_images(storage_path, is_primary)`
  ).single();

  if (productError || !updatedProducts) {
    return NextResponse.json({ error: productError?.message ?? 'Failed to update product' }, { status: 500 });
  }

  if (Array.isArray(image_urls)) {
    await supabaseAdmin.from('product_images').delete().eq('product_id', productId);
    if (image_urls.length > 0) {
      await supabaseAdmin.from('product_images').insert(
        image_urls.map((url: string, index: number) => ({
          product_id: productId,
          storage_path: url,
          is_primary: index === 0,
        }))
      );
    }
  }

  const { data: refreshedProduct } = await supabaseAdmin.from('products')
    .select(
      `id, name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status, created_at, updated_at, categories(name), brands(name), product_images(storage_path, is_primary)`
    )
    .eq('id', productId)
    .single();

  if (!refreshedProduct) {
    return NextResponse.json({ error: 'Failed to load updated product' }, { status: 500 });
  }

  return NextResponse.json({ product: normalizeProduct(refreshedProduct) });
}

export async function DELETE(_req: Request, context: { params: unknown }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = (await Promise.resolve(context.params)) as { productId: string };
  const productId = Number(params.productId);
  const { error } = await supabaseAdmin.from('products').delete().eq('id', productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
