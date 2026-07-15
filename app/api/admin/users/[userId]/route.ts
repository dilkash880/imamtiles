import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin/authorize';
import { updateUserRole } from '@/lib/admin/users';

export async function PATCH(req: Request, context: any) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = context?.params?.userId;
  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  const body = await req.json();
  const roleId = Number(body?.role_id);
  if (!roleId || Number.isNaN(roleId)) {
    return NextResponse.json({ error: 'Missing or invalid role_id' }, { status: 400 });
  }

  const user = await updateUserRole(userId, roleId);
  if (!user) {
    return NextResponse.json({ error: 'Unable to update user role' }, { status: 500 });
  }

  return NextResponse.json({ user });
}
