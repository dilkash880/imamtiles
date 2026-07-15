import { requireCustomer } from '@/lib/serverAuth';
import { getCustomerEnquiryHistory } from '@/lib/admin/enquiries';
import { ProMaxPanel } from '@/components/ui-pro-max';
import { SectionHeading } from '@/components/SectionHeading';

// Auth-gated: must never be statically cached/prerendered, even if
// Supabase env vars happen to be unset at build time.
export const dynamic = 'force-dynamic';

export default async function CustomerEnquiryHistoryPage() {
  const profile = await requireCustomer();
  const enquiries = await getCustomerEnquiryHistory(profile.id);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="My enquiries"
        title="Track your requests"
        description="View your submitted showroom enquiries, uploaded images, admin replies, and status updates."
      />

      {enquiries.length === 0 ? (
        <ProMaxPanel>
          <p className="text-slate-700 dark:text-slate-300">No enquiries found yet. Submit a new enquiry from the contact page and check back for replies.</p>
        </ProMaxPanel>
      ) : (
        <div className="space-y-6">
          {enquiries.map((enquiry) => (
            <ProMaxPanel key={enquiry.id}>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Enquiry #{enquiry.id}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{enquiry.type ?? 'Product enquiry'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Submitted on {new Date(enquiry.created_at ?? '').toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-900 dark:bg-slate-800 dark:text-white">
                    {enquiry.status}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">Your message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{enquiry.message}</p>
                </div>

                {enquiry.images.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {enquiry.images.map((image) => (
                      <a key={image.id} href={image.public_url ?? '#'} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white dark:border-white/10 dark:bg-slate-950">
                        {image.public_url ? (
                          <img src={image.public_url} alt="Enquiry upload" className="h-48 w-full object-cover" />
                        ) : (
                          <div className="flex h-48 items-center justify-center text-sm text-slate-500">Image unavailable</div>
                        )}
                      </a>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Admin replies</h3>
                  {enquiry.replies.length === 0 ? (
                    <p className="text-sm text-slate-600 dark:text-slate-300">No reply yet. We will respond here as soon as possible.</p>
                  ) : (
                    <div className="space-y-4">
                      {enquiry.replies.map((reply) => (
                        <div key={reply.id} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900 dark:text-white">Reply from {reply.admin_name ?? 'Admin'}</p>
                            <span className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{new Date(reply.created_at ?? '').toLocaleDateString()}</span>
                          </div>
                          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{reply.message}</p>
                          {reply.outcome && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Outcome: {reply.outcome}</p>}
                          {reply.recommended_products.length > 0 && (
                            <div className="mt-3 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                              <p className="font-semibold">Recommended products</p>
                              <p className="mt-2">{reply.recommended_products.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ProMaxPanel>
          ))}
        </div>
      )}
    </div>
  );
}
