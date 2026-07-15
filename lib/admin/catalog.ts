import supabaseAdmin from '@/lib/supabaseServer';
import type { AdminBrand, AdminCategory } from '@/lib/admin/types';

export async function getAdminCategories() {
  if (!supabaseAdmin) return [] as AdminCategory[];
  const { data, error } = await supabaseAdmin.from('categories').select('id, name').order('name');
  if (error) return [] as AdminCategory[];
  return data ?? [];
}

export async function getAdminBrands() {
  if (!supabaseAdmin) return [] as AdminBrand[];
  const { data, error } = await supabaseAdmin.from('brands').select('id, name').order('name');
  if (error) return [] as AdminBrand[];
  return data ?? [];
}
