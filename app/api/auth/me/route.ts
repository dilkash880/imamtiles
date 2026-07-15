import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import supabaseAdmin from '@/lib/supabaseServer';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, profile: null }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ user, profile: null });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, phone, role_id')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ user, profile: null });
  }

  return NextResponse.json({ user, profile });
}
