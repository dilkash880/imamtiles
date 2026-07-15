import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import { authorizeAdmin } from '@/lib/admin/authorize';

export async function PATCH(req: Request, context: { params: unknown }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = (await Promise.resolve(context.params)) as { brandId: string };
  const { name } = await req.json();

  const { data, error } = await supabaseAdmin.from('brands').update({ name }).eq('id', Number(params.brandId)).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ brand: data });
}

export async function DELETE(_req: Request, context: { params: unknown }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = (await Promise.resolve(context.params)) as { brandId: string };
  const { error } = await supabaseAdmin.from('brands').delete().eq('id', Number(params.brandId));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
