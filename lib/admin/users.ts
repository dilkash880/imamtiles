import supabaseAdmin from '@/lib/supabaseServer';

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role_id: number | null;
  role_name: string | null;
  created_at: string | null;
  enquiry_count: number;
};

export type AdminRole = {
  id: number;
  name: string;
};

export type AdminUserFilters = {
  search?: string;
  role?: string;
};

export async function getAdminRoles() {
  if (!supabaseAdmin) return [] as AdminRole[];
  const { data, error } = await supabaseAdmin.from('roles').select('id, name').order('name');
  if (error || !data) return [] as AdminRole[];
  return data;
}

export async function getAdminUsers(filters: AdminUserFilters = {}) {
  if (!supabaseAdmin) return [] as AdminUser[];

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, name, email, phone, role_id, created_at, roles(name)')
    .order('created_at', { ascending: false });

  if (profileError || !profiles) return [] as AdminUser[];

  const userIds = profiles.map((profile: any) => profile.id).filter(Boolean);
  const { data: enquiryRows } = userIds.length
    ? await supabaseAdmin.from('enquiries').select('user_id')
      .in('user_id', userIds)
    : { data: [] };

  const enquiryCountByUser = new Map<string, number>();
  (enquiryRows ?? []).forEach((row: any) => {
    if (!row.user_id) return;
    enquiryCountByUser.set(row.user_id, (enquiryCountByUser.get(row.user_id) ?? 0) + 1);
  });

  let users = profiles.map((raw: any) => ({
    id: raw.id,
    name: raw.name ?? null,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    role_id: raw.role_id ?? null,
    role_name: raw.roles?.name ?? null,
    created_at: raw.created_at ?? null,
    enquiry_count: enquiryCountByUser.get(raw.id) ?? 0,
  })) as AdminUser[];

  if (filters.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    users = users.filter((user) =>
      `${user.name ?? ''} ${user.email ?? ''} ${user.phone ?? ''}`.toLowerCase().includes(term)
    );
  }

  if (filters.role && filters.role !== 'all') {
    users = users.filter((user) => user.role_name === filters.role);
  }

  return users;
}

export async function getAdminUsersPageData() {
  const [users, roles] = await Promise.all([getAdminUsers(), getAdminRoles()]);
  return { users, roles };
}

export async function updateUserRole(userId: string, roleId: number) {
  if (!supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role_id: roleId })
    .eq('id', userId)
    .select('id, name, email, phone, role_id, created_at, roles(name)')
    .single();

  if (error || !data) return null;

  const roleName = Array.isArray(data.roles)
    ? data.roles[0]?.name ?? null
    : (data.roles as { name: string } | null | undefined)?.name ?? null;

  return {
    id: data.id,
    name: data.name ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    role_id: data.role_id ?? null,
    role_name: roleName,
    created_at: data.created_at ?? null,
    enquiry_count: 0,
  } as AdminUser;
}
