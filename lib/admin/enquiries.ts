import supabaseAdmin from '@/lib/supabaseServer';
import type { AdminReply, EnquiryRecord, EnquiryStatus, EnquiryImage } from '@/lib/enquiries';
import { getSignedImageUrl } from '@/lib/enquiryStorage';

type AdminEnquiryFilters = {
  status?: string;
  search?: string;
};

function mapAdminReply(raw: any): AdminReply {
  return {
    id: raw.id,
    admin_id: raw.admin_id,
    admin_name: raw.profiles?.name ?? null,
    message: raw.message ?? null,
    outcome: raw.outcome ?? null,
    recommended_products: Array.isArray(raw.recommended_products) ? raw.recommended_products : [],
    created_at: raw.created_at ?? null,
  };
}

function mapEnquiryImage(raw: any): EnquiryImage {
  return {
    id: raw.id,
    storage_path: raw.storage_path,
    public_url: raw.public_url ?? null,
    metadata: raw.metadata ?? null,
    created_at: raw.created_at ?? null,
  };
}

export async function getAdminEnquiries(filters: AdminEnquiryFilters = {}) {
  if (!supabaseAdmin) return [] as EnquiryRecord[];

  let query = supabaseAdmin
    .from('enquiries')
    .select('id, user_id, name, email, phone, message, type, status, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.search) {
    const value = `%${filters.search}%`;
    query = query.or(`name.ilike.${value},email.ilike.${value},phone.ilike.${value}`);
  }

  const { data: enquiryRows, error: enquiryError } = await query;
  if (enquiryError || !enquiryRows) return [] as EnquiryRecord[];

  const enquiryIds = enquiryRows.map((enquiry: any) => enquiry.id);

  const { data: imageRows } = enquiryIds.length
    ? await supabaseAdmin
        .from('enquiry_images')
        .select('id, enquiry_id, storage_path, metadata, created_at')
        .in('enquiry_id', enquiryIds)
    : { data: [] };

  const { data: replyRows } = enquiryIds.length
    ? await supabaseAdmin
        .from('admin_replies')
        .select('id, enquiry_id, admin_id, message, outcome, recommended_products, created_at, profiles(name)')
        .in('enquiry_id', enquiryIds)
    : { data: [] };

  const imagesByEnquiry = new Map<number, EnquiryImage[]>();
  await Promise.all(
    (imageRows ?? []).map(async (image: any) => {
      const public_url = await getSignedImageUrl(image.storage_path);
      const mapped = mapEnquiryImage({ ...image, public_url });
      const list = imagesByEnquiry.get(image.enquiry_id) ?? [];
      list.push(mapped);
      imagesByEnquiry.set(image.enquiry_id, list);
    })
  );

  const repliesByEnquiry = new Map<number, AdminReply[]>();
  (replyRows ?? []).forEach((reply: any) => {
    const list = repliesByEnquiry.get(reply.enquiry_id) ?? [];
    list.push(mapAdminReply(reply));
    repliesByEnquiry.set(reply.enquiry_id, list);
  });

  return (enquiryRows ?? []).map((enquiry: any) => ({
    id: enquiry.id,
    user_id: enquiry.user_id ?? null,
    name: enquiry.name ?? null,
    email: enquiry.email ?? null,
    phone: enquiry.phone ?? null,
    message: enquiry.message ?? null,
    type: enquiry.type ?? null,
    status: (enquiry.status ?? 'new') as EnquiryStatus,
    created_at: enquiry.created_at ?? null,
    updated_at: enquiry.updated_at ?? null,
    images: imagesByEnquiry.get(enquiry.id) ?? [],
    replies: repliesByEnquiry.get(enquiry.id) ?? [],
  }));
}

export async function getCustomerEnquiryHistory(userId: string) {
  if (!supabaseAdmin) return [] as EnquiryRecord[];

  const { data: enquiryRows, error: enquiryError } = await supabaseAdmin
    .from('enquiries')
    .select('id, user_id, name, email, phone, message, type, status, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (enquiryError || !enquiryRows) return [] as EnquiryRecord[];

  const enquiryIds = enquiryRows.map((enquiry: any) => enquiry.id);

  const { data: imageRows } = enquiryIds.length
    ? await supabaseAdmin
        .from('enquiry_images')
        .select('id, enquiry_id, storage_path, metadata, created_at')
        .in('enquiry_id', enquiryIds)
    : { data: [] };

  const { data: replyRows } = enquiryIds.length
    ? await supabaseAdmin
        .from('admin_replies')
        .select('id, enquiry_id, admin_id, message, outcome, recommended_products, created_at, profiles(name)')
        .in('enquiry_id', enquiryIds)
    : { data: [] };

  const imagesByEnquiry = new Map<number, EnquiryImage[]>();
  await Promise.all(
    (imageRows ?? []).map(async (image: any) => {
      const public_url = await getSignedImageUrl(image.storage_path);
      const mapped = mapEnquiryImage({ ...image, public_url });
      const list = imagesByEnquiry.get(image.enquiry_id) ?? [];
      list.push(mapped);
      imagesByEnquiry.set(image.enquiry_id, list);
    })
  );

  const repliesByEnquiry = new Map<number, AdminReply[]>();
  (replyRows ?? []).forEach((reply: any) => {
    const list = repliesByEnquiry.get(reply.enquiry_id) ?? [];
    list.push(mapAdminReply(reply));
    repliesByEnquiry.set(reply.enquiry_id, list);
  });

  return (enquiryRows ?? []).map((enquiry: any) => ({
    id: enquiry.id,
    user_id: enquiry.user_id ?? null,
    name: enquiry.name ?? null,
    email: enquiry.email ?? null,
    phone: enquiry.phone ?? null,
    message: enquiry.message ?? null,
    type: enquiry.type ?? null,
    status: (enquiry.status ?? 'new') as EnquiryStatus,
    created_at: enquiry.created_at ?? null,
    updated_at: enquiry.updated_at ?? null,
    images: imagesByEnquiry.get(enquiry.id) ?? [],
    replies: repliesByEnquiry.get(enquiry.id) ?? [],
  }));
}

export async function createAdminReply(enquiryId: number, adminId: string, message: string, outcome: string | null, recommended_products: string[]) {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('admin_replies')
    .insert({ enquiry_id: enquiryId, admin_id: adminId, message, outcome, recommended_products })
    .select('id, enquiry_id, admin_id, message, outcome, recommended_products, created_at, profiles(name)')
    .single();

  if (error) {
    throw error;
  }

  return mapAdminReply(data);
}
