import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!serviceKey || !supabaseUrl) {
  // Do not throw to avoid breaking local frontend-only workflows.
  // eslint-disable-next-line no-console
  console.warn('Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL. Server Supabase client not fully configured.');
}

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;

export default supabaseAdmin;
