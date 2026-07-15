import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin/authorize';
import { getAdminEnquiries } from '@/lib/admin/enquiries';

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;
  const enquiries = await getAdminEnquiries({ status, search });

  return NextResponse.json({ enquiries });
}
