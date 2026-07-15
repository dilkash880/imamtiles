import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn('Missing NEXT_PUBLIC_SUPABASE_* env vars. Supabase client will not be initialized.');
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
