'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EnquiryRecord } from '@/lib/enquiries';
import { ProMaxButton, ProMaxPanel } from '@/components/ui-pro-max';

const statusOptions = ['all', 'new', 'in progress', 'replied', 'closed'] as const;
const statusValues = ['new', 'in progress', 'replied', 'closed'] as const;

type StatusOption = (typeof statusOptions)[number];

export default function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusOption>('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyOutcome, setReplyOutcome] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState('');

  const counts = useMemo(() => {
    const total = enquiries.length;
    const stats = statusValues.reduce<Record<typeof statusValues[number], number>>((acc, status) => {
      acc[status] = enquiries.filter((item) => item.status === status).length;
      return acc;
    }, {
      'new': 0,
      'in progress': 0,
      replied: 0,
      closed: 0,
    });
    return { total, ...stats };
  }, [enquiries]);

  async function loadEnquiries() {
    setLoading(true);
    setMessage(null);

    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.set('status', statusFilter);
      if (search.trim()) query.set('search', search.trim());

      const response = await fetch(`/api/admin/enquiries?${query.toString()}`);
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error || 'Failed to load enquiries.');
        return;
      }
      setEnquiries(payload.enquiries ?? []);
      if (selectedEnquiry) {
        const refreshed = (payload.enquiries ?? []).find((item: EnquiryRecord) => item.id === selectedEnquiry.id) ?? null;
        setSelectedEnquiry(refreshed);
      }
    } catch (error: any) {
      setMessage(error?.message || 'Unable to load enquiries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function handleRefresh() {
    await loadEnquiries();
  }

  async function handleSelect(enquiry: EnquiryRecord) {
    setSelectedEnquiry(enquiry);
    setReplyMessage('');
    setReplyOutcome('');
    setRecommendedProducts(enquiry.replies.flatMap((reply) => reply.recommended_products).join(', '));
  }

  async function submitReply() {
    if (!selectedEnquiry) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          outcome: replyOutcome,
          recommended_products: recommendedProducts.split(',').map((item) => item.trim()).filter(Boolean),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error || 'Failed to send reply.');
        return;
      }

      setMessage('Reply sent successfully.');
      await loadEnquiries();
      setReplyMessage('');
    } catch (error: any) {
      setMessage(error?.message || 'Unable to send reply.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: string) {
    if (!selectedEnquiry) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.error || 'Failed to update status.');
        return;
      }

      setMessage('Status updated successfully.');
      await loadEnquiries();
    } catch (error: any) {
      setMessage(error?.message || 'Unable to update status.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProMaxPanel className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Enquiry dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Manage customer enquiries</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">Search, filter, review images, reply to messages, and update enquiry status.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ProMaxButton type="button" variant="secondary" onClick={handleRefresh}>Refresh</ProMaxButton>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
            <span className="block text-slate-500 dark:text-slate-400">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Customer name, email or phone"
              className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            />
          </label>
          <label className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
            <span className="block text-slate-500 dark:text-slate-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusOption)}
              className="mt-2 w-full bg-transparent text-slate-900 outline-none dark:text-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2 lg:col-span-2">
            <ProMaxButton type="button" onClick={loadEnquiries} className="w-full">Apply filters</ProMaxButton>
          </div>
        </div>
      </ProMaxPanel>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <ProMaxPanel>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Overview</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{counts.total} enquiries</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {statusValues.map((status) => (
                  <div key={status} className="rounded-3xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{status}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{counts[status]}</p>
                  </div>
                ))}
              </div>
            </div>
          </ProMaxPanel>

          <ProMaxPanel>
            <div className="overflow-hidden rounded-[1.6rem] border border-slate-200/70 dark:border-white/10">
              <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-t border-slate-200/70 dark:border-white/10">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-950 dark:text-white">{enquiry.name ?? 'Guest'}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{enquiry.email ?? enquiry.phone ?? 'No contact'}</div>
                      </td>
                      <td className="px-4 py-4">{enquiry.type ?? 'General'}</td>
                      <td className="px-4 py-4 capitalize">{enquiry.status}</td>
                      <td className="px-4 py-4">{new Date(enquiry.created_at ?? '').toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <ProMaxButton type="button" variant="secondary" onClick={() => handleSelect(enquiry)}>
                          View
                        </ProMaxButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ProMaxPanel>
        </div>

        <div className="space-y-4">
          {selectedEnquiry ? (
            <ProMaxPanel>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Enquiry #{selectedEnquiry.id}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{selectedEnquiry.name ?? 'Guest enquiry'}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEnquiry.email ?? selectedEnquiry.phone}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-900 dark:bg-slate-800 dark:text-white">
                    {selectedEnquiry.status}
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200/70 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Customer message</p>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{selectedEnquiry.message ?? 'No message provided.'}</p>
                </div>

                {selectedEnquiry.images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Uploaded images</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedEnquiry.images.map((image) => (
                        <a key={image.id} href={image.public_url ?? '#'} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950">
                          {image.public_url ? (
                            <img src={image.public_url} alt="Enquiry upload" className="h-32 w-full object-cover" />
                          ) : (
                            <div className="flex h-32 items-center justify-center text-sm text-slate-500">Image unavailable</div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-3">
                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    <span className="mb-2 block font-medium">Status</span>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(event) => updateStatus(event.target.value)}
                      className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
                    >
                      {statusOptions.slice(1).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    <span className="mb-2 block font-medium">Reply message</span>
                    <textarea
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                      rows={4}
                      placeholder="Type a customer reply"
                      className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
                    />
                  </label>

                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    <span className="mb-2 block font-medium">Recommended products</span>
                    <input
                      value={recommendedProducts}
                      onChange={(event) => setRecommendedProducts(event.target.value)}
                      placeholder="Comma-separated product names"
                      className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
                    />
                  </label>

                  <label className="block text-sm text-slate-700 dark:text-slate-300">
                    <span className="mb-2 block font-medium">Outcome summary</span>
                    <input
                      value={replyOutcome}
                      onChange={(event) => setReplyOutcome(event.target.value)}
                      placeholder="Short internal outcome note"
                      className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
                    />
                  </label>

                  {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ProMaxButton type="button" disabled={loading || !replyMessage.trim()} onClick={submitReply} className="w-full">
                      Send reply
                    </ProMaxButton>
                    <ProMaxButton type="button" variant="secondary" disabled={loading} onClick={handleRefresh} className="w-full">
                      Refresh
                    </ProMaxButton>
                  </div>
                </div>
              </div>
            </ProMaxPanel>
          ) : (
            <ProMaxPanel>
              <p className="text-slate-700 dark:text-slate-300">Select an enquiry to review details, images, and send a reply.</p>
            </ProMaxPanel>
          )}
        </div>
      </div>
    </div>
  );
}
