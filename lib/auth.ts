import { createClient } from './supabase/browser';

function ensureBrowserClient() {
  const client = createClient();
  if (!client) {
    throw new Error('Supabase browser client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return client;
}

export async function registerUser({ email, password, name, phone }: { email: string; password: string; name?: string; phone?: string }) {
  const client = ensureBrowserClient();
  // The profiles row is created server-side by the on_auth_user_created
  // trigger (db/migrations/005_profile_auto_creation.sql), which reads
  // name/phone from this metadata. A client-side insert here can't work:
  // it would need to run before email confirmation, when the client has no
  // session yet, and profiles has no RLS insert policy for that case.
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });
  if (error) throw error;

  return data;
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const client = ensureBrowserClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const client = ensureBrowserClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function requestPasswordReset({ email }: { email: string }) {
  const client = ensureBrowserClient();
  const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset-password`;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function updatePassword({ password }: { password: string }) {
  const client = ensureBrowserClient();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}

export async function getCurrentProfile() {
  const client = ensureBrowserClient();
  const { data } = await client.auth.getUser();
  if (!data?.user) return null;
  const { data: profile } = await client.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
  return profile ?? null;
}
