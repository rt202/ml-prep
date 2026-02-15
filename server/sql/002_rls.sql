-- Enable RLS
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.question_history enable row level security;
alter table public.review_queue enable row level security;
alter table public.daily_xp enable row level security;
alter table public.custom_units enable row level security;
alter table public.custom_lessons enable row level security;
alter table public.custom_questions enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Helper: admin role check via profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

-- User-owned tables: user can only access own rows
create policy "profiles_select_own" on public.profiles
  for select using (user_id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (user_id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (user_id = auth.uid());

create policy "progress_select_own" on public.progress
  for select using (user_id = auth.uid());
create policy "progress_update_own" on public.progress
  for update using (user_id = auth.uid());
create policy "progress_insert_own" on public.progress
  for insert with check (user_id = auth.uid());

create policy "lesson_progress_all_own" on public.lesson_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "question_history_all_own" on public.question_history
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "review_queue_all_own" on public.review_queue
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "daily_xp_all_own" on public.daily_xp
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Content tables: anyone can read published content; only admins can mutate
create policy "custom_units_read_published" on public.custom_units
  for select using (is_published = true or public.is_admin());
create policy "custom_units_admin_mutate" on public.custom_units
  for all using (public.is_admin()) with check (public.is_admin());

create policy "custom_lessons_read_published" on public.custom_lessons
  for select using (is_published = true or public.is_admin());
create policy "custom_lessons_admin_mutate" on public.custom_lessons
  for all using (public.is_admin()) with check (public.is_admin());

create policy "custom_questions_read_published" on public.custom_questions
  for select using (is_published = true or public.is_admin());
create policy "custom_questions_admin_mutate" on public.custom_questions
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_audit_admin_only" on public.admin_audit_logs
  for select using (public.is_admin());
create policy "admin_audit_insert_admin_only" on public.admin_audit_logs
  for insert with check (public.is_admin());
