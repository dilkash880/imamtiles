import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin/authorize';
import { updateAdminProfile } from '@/lib/admin/profile';

export async function PATCH(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const id = body?.id;
  const name = body?.name ?? null;
  const phone = body?.phone ?? null;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing admin profile id' }, { status: 400 });
  }

  const updated = await updateAdminProfile({ id, name, phone });
  if (!updated) {
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 });
  }

  return NextResponse.json({ profile: updated });
}
