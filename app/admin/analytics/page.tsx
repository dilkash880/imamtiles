import { requireAdmin } from '@/lib/serverAuth';
import { SectionHeading } from '@/components/SectionHeading';
import { ProMaxPanel } from '@/components/ui-pro-max';
import { getAdminAnalyticsSummary } from '@/lib/admin/analytics';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const summary = await getAdminAnalyticsSummary();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Analytics"
        title="Dashboard analytics"
        description="Track showroom performance with enquiry volume, product popularity, and customer activity."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Enquiries</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{summary.totalEnquiries}</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>New: {summary.statusCounts.new}</p>
            <p>In progress: {summary.statusCounts['in progress']}</p>
            <p>Replied: {summary.statusCounts.replied}</p>
            <p>Closed: {summary.statusCounts.closed}</p>
          </div>
        </ProMaxPanel>

        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Customers</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{summary.totalCustomers}</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Registered showroom customers</p>
        </ProMaxPanel>

        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Products</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{summary.totalProducts}</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Low stock products: {summary.lowStockProducts}</p>
        </ProMaxPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Performance</p>
          <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">
            {summary.averageResponseHours !== null ? `${summary.averageResponseHours}h` : 'N/A'}
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Average admin response time</p>
        </ProMaxPanel>

        <ProMaxPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Catalog</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">{summary.totalCategories + summary.totalBrands}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <p>{summary.totalCategories} categories</p>
              <p>{summary.totalBrands} brands</p>
            </div>
          </div>
        </ProMaxPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Popular enquiry types</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {summary.popularEnquiryTypes.length > 0 ? (
              summary.popularEnquiryTypes.map((item) => (
                <div key={item.type} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 dark:bg-slate-950/70">
                  <span>{item.type}</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{item.count}</span>
                </div>
              ))
            ) : (
              <p>No enquiry type data yet.</p>
            )}
          </div>
        </ProMaxPanel>

        <ProMaxPanel>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Recommended products</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {summary.recommendedProducts.length > 0 ? (
              summary.recommendedProducts.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 dark:bg-slate-950/70">
                  <span>{item.name}</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{item.count}</span>
                </div>
              ))
            ) : (
              <p>No recommended product data yet.</p>
            )}
          </div>
        </ProMaxPanel>
      </div>
    </div>
  );
}
