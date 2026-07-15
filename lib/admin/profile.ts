import supabaseAdmin from '@/lib/supabaseServer';
import { getServerProfile } from '@/lib/serverAuth';

export type AdminProfile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role_id: number | null;
  created_at: string | null;
};

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const profile = await getServerProfile();
  if (!profile) return null;

  return {
    id: profile.id,
    name: profile.name ?? null,
    email: profile.email ?? null,
    phone: profile.phone ?? null,
    role_id: profile.role_id ?? null,
    created_at: profile.created_at ?? null,
  };
}

export async function updateAdminProfile({ id, name, phone }: { id: string; name: string | null; phone: string | null; }): Promise<AdminProfile | null> {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ name, phone })
    .eq('id', id)
    .select('id, name, email, phone, role_id, created_at')
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    role_id: data.role_id ?? null,
    created_at: data.created_at ?? null,
  };
}
