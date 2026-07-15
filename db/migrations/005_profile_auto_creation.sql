-- Automatically create a profiles row whenever a new Supabase Auth user is
-- created. This runs as SECURITY DEFINER (bypassing RLS), which is required
-- because the client is not authenticated yet at signup time (email
-- confirmation is required before a session exists), so a client-side
-- insert into profiles can never succeed on its own.
--
-- name/phone are read from the user_metadata passed to auth.signUp()'s
-- `options.data` (see lib/auth.ts:registerUser).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, role_id)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    2 -- default every new signup to the customer role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing auth.users that don't already have a profile
-- (e.g. accounts created before this trigger existed).
insert into public.profiles (id, email, role_id)
select u.id, u.email, 2
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
