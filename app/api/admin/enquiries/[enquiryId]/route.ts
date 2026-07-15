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

  const params = (await Promise.resolve(context.params)) as { enquiryId: string };
  const enquiryId = Number(params.enquiryId);
  const body = await req.json();
  const status = body.status?.trim();

  if (!status) {
    return NextResponse.json({ error: 'Status is required.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('enquiries')
    .update({ status })
    .eq('id', enquiryId)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Failed to update enquiry.' }, { status: 500 });
  }

  return NextResponse.json({ enquiry: data });
}
