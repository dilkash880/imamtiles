-- Creates the private storage bucket used for tile-enquiry photo uploads
-- (lib/enquiryStorage.ts). Run this in the Supabase SQL editor after
-- 001-003, or create the bucket manually via Storage > New bucket
-- (name: enquiry-uploads, Public: off).
--
-- The bucket is kept private: uploads and reads both go through the
-- service_role key (lib/supabaseServer.ts), which bypasses RLS, and
-- customers/admins only ever see images via short-lived signed URLs
-- (lib/enquiryStorage.ts:getSignedImageUrl). No anon/authenticated
-- storage policies are required as a result.

insert into storage.buckets (id, name, public)
values ('enquiry-uploads', 'enquiry-uploads', false)
on conflict (id) do nothing;
