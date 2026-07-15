import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import supabaseAdmin from './supabaseServer';

type ProfileRecord = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role_id?: number | null;
  created_at?: string | null;
};

export async function getServerUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getServerProfile(): Promise<ProfileRecord | null> {
  const user = await getServerUser();
  if (!user || !supabaseAdmin) return null;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, phone, role_id')
    .eq('id', user.id)
    .single();

  if (error || !profile) return null;
  return profile as ProfileRecord;
}

export async function requireAdmin(): Promise<ProfileRecord> {
  const profile = await getServerProfile();
  if (!profile || profile.role_id !== 1) {
    redirect('/auth/login');
  }
  return profile;
}

export async function requireCustomer(): Promise<ProfileRecord> {
  const profile = await getServerProfile();
  if (!profile || (profile.role_id !== 2 && profile.role_id !== 1)) {
    redirect('/auth/login');
  }
  return profile;
}
