import { NextResponse } from 'next/server';
import { authorizeAdmin } from '@/lib/admin/authorize';
import { getAdminAnalyticsSummary } from '@/lib/admin/analytics';

export async function GET() {
  if (!(await authorizeAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = await getAdminAnalyticsSummary();
  return NextResponse.json({ summary });
}
