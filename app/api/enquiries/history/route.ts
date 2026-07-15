import { NextResponse } from 'next/server';
import { getServerProfile } from '@/lib/serverAuth';
import { getCustomerEnquiryHistory } from '@/lib/admin/enquiries';

export async function GET() {
  const profile = await getServerProfile();
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const enquiries = await getCustomerEnquiryHistory(profile.id);
  return NextResponse.json({ enquiries });
}
