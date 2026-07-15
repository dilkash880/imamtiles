-- Recommended RLS policies for Imam Marble & Tiles
-- Apply these in Supabase SQL editor after running 001_init.sql

-- Enable RLS where appropriate
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table enquiries enable row level security;
alter table enquiry_images enable row level security;
alter table admin_replies enable row level security;
alter table wishlists enable row level security;
alter table contact_messages enable row level security;

-- Allow authenticated users to read products
create policy "public_select_products" on products
  for select using (true);

-- Allow admins (role_id -> roles.name = 'admin') to manage products
create policy "admins_manage_products" on products
  for all using (
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id where p.id = auth.uid() and r.name = 'admin'
    )
  ) with check (
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id where p.id = auth.uid() and r.name = 'admin'
    )
  );

-- Profiles: allow users to read their own profile
create policy "self_profiles" on profiles
  for select using (id = auth.uid());

create policy "self_profiles_update" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Enquiries: allow authenticated users to insert enquiries tied to their uid
-- (Note: the app's enquiry submission route uses the service role key, which
-- bypasses RLS entirely, so this policy only matters if enquiries are ever
-- inserted directly from a browser/anon client in the future.)
create policy "insert_enquiry_authenticated" on enquiries
  for insert with check (
    user_id IS NULL OR user_id = auth.uid()
  );

-- Enquiries: allow owner to read their enquiries
create policy "select_enquiry_owner" on enquiries
  for select using (
    user_id = auth.uid() OR user_id IS NULL
  );

-- Admins can manage enquiries
create policy "admins_manage_enquiries" on enquiries
  for all using (
    exists (select 1 from profiles p join roles r on p.role_id = r.id where p.id = auth.uid() and r.name = 'admin')
  ) with check (
    exists (select 1 from profiles p join roles r on p.role_id = r.id where p.id = auth.uid() and r.name = 'admin')
  );

-- Wishlists: users can insert/delete their own wishlist items
create policy "wishlist_crud_own" on wishlists
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Contact messages: allow anonymous inserts
create policy "public_insert_contact_messages" on contact_messages
  for insert with check (true);

-- Product images and enquiry images: allow server/service role to insert/manage
-- Note: storage paths should be managed by server functions or admin users.

-- IMPORTANT: review these policies and test carefully in Supabase. Adjust policies to match your desired access model.
