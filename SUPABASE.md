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

Running the initial SQL migration:

- From the Supabase dashboard use the SQL editor and paste `db/migrations/001_init.sql` and run it.
- Or use the Supabase CLI / psql against your database and execute the SQL file.

Security notes:

- Never expose the `SUPABASE_SERVICE_KEY` to the client. Only import `lib/supabaseServer.ts` in server components or API routes.
- Use RLS policies in Supabase to restrict access; we will add recommended policies during the auth phase.

Next steps (Phase 3 after you confirm):

- Implement Auth flows and `profiles` management.
- Add server middleware to protect admin routes.
- Replace `lib/products.ts` static data with DB-backed queries in server components.
