import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseServer';
import { getServerProfile } from '@/lib/serverAuth';
import { createAdminReply } from '@/lib/admin/enquiries';
import { sendEnquiryUpdateNotification } from '@/lib/notifications';

export async function POST(req: Request, context: { params: unknown }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase server client not configured' }, { status: 500 });
  }

  const profile = await getServerProfile();
  if (!profile || profile.role_id !== 1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = (await Promise.resolve(context.params)) as { enquiryId: string };
  const enquiryId = Number(params.enquiryId);
  const payload = await req.json();
  const message = payload.message?.trim() ?? '';
  const outcome = payload.outcome?.trim() ?? null;
  const recommended_products = Array.isArray(payload.recommended_products)
    ? payload.recommended_products
    : typeof payload.recommended_products === 'string'
    ? payload.recommended_products.split(',').map((item: string) => item.trim()).filter(Boolean)
    : [];
  const status = payload.status?.trim();

  if (!message) {
    return NextResponse.json({ error: 'Reply message is required.' }, { status: 400 });
  }

  const reply = await createAdminReply(enquiryId, profile.id, message, outcome, recommended_products);
  if (!reply) {
    return NextResponse.json({ error: 'Failed to create reply.' }, { status: 500 });
  }

  if (status) {
    await supabaseAdmin.from('enquiries').update({ status }).eq('id', enquiryId);
  }

  const { data: enquiry } = await supabaseAdmin.from('enquiries').select('email, phone, status').eq('id', enquiryId).single();
  if (enquiry) {
    await sendEnquiryUpdateNotification({
      email: enquiry.email ?? null,
      phone: enquiry.phone ?? null,
      status: enquiry.status ?? 'replied',
      replyMessage: message,
    });
  }

  return NextResponse.json({ reply });
}
