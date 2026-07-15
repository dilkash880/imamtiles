import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin/authorize';
import { getAdminRoles, getAdminUsers } from '@/lib/admin/users';

export async function GET(req: Request) {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.searchParams.get('search') ?? undefined;
  const role = url.searchParams.get('role') ?? undefined;
  const users = await getAdminUsers({ search, role });
  const roles = await getAdminRoles();

  return NextResponse.json({ users, roles });
}
