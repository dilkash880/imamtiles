import supabaseAdmin from '@/lib/supabaseServer';
import type { EnquiryStatus } from '@/lib/enquiries';

const defaultStatusCounts: Record<EnquiryStatus, number> = {
  new: 0,
  'in progress': 0,
  replied: 0,
  closed: 0,
};

export type AnalyticsSummary = {
  totalEnquiries: number;
  statusCounts: Record<EnquiryStatus, number>;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCategories: number;
  totalBrands: number;
  averageResponseHours: number | null;
  popularEnquiryTypes: Array<{ type: string; count: number }>;
  recommendedProducts: Array<{ name: string; count: number }>;
};

async function countTableRows(table: string, filter?: (query: any) => any) {
  if (!supabaseAdmin) return 0;
  let query: any = supabaseAdmin.from(table).select('id', { count: 'exact', head: true });
  if (filter) query = filter(query);
  const { count } = await query;
  return Number(count ?? 0);
}

export async function getAdminAnalyticsSummary(): Promise<AnalyticsSummary> {
  if (!supabaseAdmin) {
    return {
      totalEnquiries: 0,
      statusCounts: { ...defaultStatusCounts },
      totalCustomers: 0,
      totalProducts: 0,
      lowStockProducts: 0,
      totalCategories: 0,
      totalBrands: 0,
      averageResponseHours: null,
      popularEnquiryTypes: [],
      recommendedProducts: [],
    };
  }

  const [enquiryRows, customerCount, productCount, categoryCount, brandCount, lowStockCount, replyRows] = await Promise.all([
    supabaseAdmin.from('enquiries').select('status, type'),
    countTableRows('profiles', (query) => query.eq('role_id', 2)),
    countTableRows('products'),
    countTableRows('categories'),
    countTableRows('brands'),
    countTableRows('products', (query) => query.lte('stock', 5)),
    supabaseAdmin.from('admin_replies').select('created_at, enquiry_id, enquiries(created_at), recommended_products'),
  ]);

  const statusCounts = { ...defaultStatusCounts };
  const typeCounts: Record<string, number> = {};

  if (enquiryRows.data) {
    for (const row of enquiryRows.data) {
      const status = (row.status as EnquiryStatus) ?? 'new';
      if (statusCounts[status] !== undefined) {
        statusCounts[status] += 1;
      }
      const type = (row.type ?? 'general').toString();
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    }
  }

  const popularEnquiryTypes = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recommendedProducts: Record<string, number> = {};
  const responseDiffs: number[] = [];

  if (replyRows.data) {
    for (const row of replyRows.data) {
      const recommended = Array.isArray(row.recommended_products) ? row.recommended_products : [];
      for (const product of recommended) {
        const name = String(product ?? '').trim();
        if (!name) continue;
        recommendedProducts[name] = (recommendedProducts[name] ?? 0) + 1;
      }

      const replyCreated = row.created_at ? new Date(row.created_at).getTime() : null;
      const enquiryCreatedRaw = Array.isArray(row.enquiries) ? row.enquiries[0] : row.enquiries;
      const enquiryCreated = enquiryCreatedRaw?.created_at ? new Date(enquiryCreatedRaw.created_at).getTime() : null;
      if (replyCreated && enquiryCreated && replyCreated > enquiryCreated) {
        responseDiffs.push((replyCreated - enquiryCreated) / 1000 / 60 / 60);
      }
    }
  }

  const averageResponseHours = responseDiffs.length
    ? Number((responseDiffs.reduce((sum, value) => sum + value, 0) / responseDiffs.length).toFixed(1))
    : null;

  return {
    totalEnquiries: enquiryRows.count ?? (enquiryRows.data?.length ?? 0),
    statusCounts,
    totalCustomers: customerCount,
    totalProducts: productCount,
    lowStockProducts: lowStockCount,
    totalCategories: categoryCount,
    totalBrands: brandCount,
    averageResponseHours,
    popularEnquiryTypes,
    recommendedProducts: Object.entries(recommendedProducts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}
