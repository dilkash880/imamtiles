# Supabase integration guide

This project will use Supabase for Auth, Postgres (DB), and Storage (images).

Quick steps to get started:

1. Create a Supabase project at https://app.supabase.com
2. In the Supabase project settings, get the `API URL` and `anon public key`.
3. Generate a `service_role` key (store this securely; it must not be exposed to clients).
4. Copy `.env.example` to `.env.local` and fill in the values.

Environment variables required (Vercel):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key (safe for browser)
- `SUPABASE_SERVICE_KEY` — Service role key (server-only)

Running the SQL migrations:

Run these in order from the Supabase dashboard SQL editor (or via the Supabase CLI / psql), each after the last:

1. `db/migrations/001_init.sql` — core schema (roles, profiles, products, enquiries, wishlists, etc.)
2. `db/migrations/002_rls.sql` — recommended row-level security policies
3. `db/migrations/003_admin_replies_recommendations.sql` — adds recommended-products support to admin replies
4. `db/migrations/004_enquiry_storage_bucket.sql` — creates the private `enquiry-uploads` Storage bucket used for tile-photo enquiry uploads (`lib/enquiryStorage.ts`). Uploads/reads go through the service role key, so no additional storage policies are needed.

Security notes:

- Never expose the `SUPABASE_SERVICE_KEY` to the client. Only import `lib/supabaseServer.ts` in server components or API routes.
- Use RLS policies in Supabase to restrict access; see `002_rls.sql` for the recommended baseline.
