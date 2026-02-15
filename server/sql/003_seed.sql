-- Seed admin profile for an existing auth user email (adjust as needed)
-- Run after creating the user in Supabase Auth.

insert into public.profiles (user_id, email, display_name, role, difficulty, company_size, avatar_seed)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
  case
    when lower(coalesce(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))) = 'ro' then 'admin'
    else 'user'
  end,
  'medium',
  'large',
  substring(gen_random_uuid()::text from 1 for 8)
from auth.users u
where u.email = 'ro@local.dev'
on conflict (user_id) do update
set display_name = excluded.display_name,
    role = excluded.role,
    updated_at = now();

insert into public.progress (user_id)
select p.user_id from public.profiles p
where p.email = 'ro@local.dev'
on conflict (user_id) do nothing;
