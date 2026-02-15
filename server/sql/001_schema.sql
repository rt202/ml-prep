-- Supabase schema bootstrap for multi-user interview prep
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  difficulty text not null default 'medium',
  company_size text not null default 'large',
  avatar_seed text not null default substring(gen_random_uuid()::text from 1 for 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  total_questions_answered integer not null default 0,
  total_correct integer not null default 0,
  hearts_remaining integer not null default 5,
  max_hearts integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_key text not null,
  best_score integer not null default 0,
  attempts integer not null default 0,
  completed boolean not null default false,
  primary key (user_id, lesson_key)
);

create table if not exists public.question_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  attempts integer not null default 0,
  correct integer not null default 0,
  last_attempted timestamptz,
  primary key (user_id, question_id)
);

create table if not exists public.review_queue (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  primary key (user_id, question_id)
);

create table if not exists public.daily_xp (
  user_id uuid not null references auth.users(id) on delete cascade,
  date_key date not null,
  xp integer not null default 0,
  primary key (user_id, date_key)
);

create table if not exists public.custom_units (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  order_index integer not null,
  is_published boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_lessons (
  id text primary key,
  unit_id text not null,
  name text not null,
  order_index integer not null,
  question_count integer not null default 0,
  is_published boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_questions (
  id text primary key,
  text text not null,
  options_json jsonb not null,
  correct_answer integer not null,
  explanation text not null,
  difficulty text not null,
  roles_json jsonb not null,
  category text not null,
  company_sizes_json jsonb not null,
  unit_id text not null,
  lesson_id text not null,
  is_published boolean not null default true,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid not null references auth.users(id),
  action text not null,
  target text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_question_history_user_qid on public.question_history(user_id, question_id);
create index if not exists idx_lesson_progress_user_key on public.lesson_progress(user_id, lesson_key);
create index if not exists idx_review_queue_user on public.review_queue(user_id);
create index if not exists idx_daily_xp_user_date on public.daily_xp(user_id, date_key);
