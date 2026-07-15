import { createClient } from './supabase/browser';

function ensureBrowserClient() {
  const client = createClient();
  if (!client) {
    throw new Error('Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return client;
}

export async function getWishlistProductIds(): Promise<Set<number>> {
  const client = ensureBrowserClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await client.from('wishlists').select('product_id').eq('user_id', user.id);
  if (error || !data) return new Set();

  return new Set(data.map((row) => row.product_id as number));
}

export async function toggleWishlist(productId: number): Promise<boolean> {
  const client = ensureBrowserClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error('You must be signed in to use the wishlist.');

  const { data: existing, error: selectError } = await client
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();
  if (selectError) throw selectError;

  if (existing) {
    const { error } = await client.from('wishlists').delete().eq('id', existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await client.from('wishlists').insert({ user_id: user.id, product_id: productId });
  if (error) throw error;
  return true;
}
