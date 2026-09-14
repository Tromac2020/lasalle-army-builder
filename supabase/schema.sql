-- Lasalle Army Maker — saved army lists table + Row Level Security policies.
--
-- Run this once in your Supabase project's SQL Editor (Supabase dashboard →
-- SQL Editor → New query → paste this whole file → Run). Safe to re-run:
-- it only creates things if they don't already exist.

create table if not exists public.army_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists army_lists_user_id_idx on public.army_lists (user_id);

-- Row Level Security: every signed-in user can only ever see or change their
-- own rows. This is what actually makes lists private per account — the
-- anon key shipped in the app has no special access, it's these policies
-- that do the enforcing, checked on Supabase's servers for every request.
alter table public.army_lists enable row level security;

drop policy if exists "Users can view their own lists" on public.army_lists;
create policy "Users can view their own lists"
  on public.army_lists for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own lists" on public.army_lists;
create policy "Users can insert their own lists"
  on public.army_lists for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own lists" on public.army_lists;
create policy "Users can update their own lists"
  on public.army_lists for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own lists" on public.army_lists;
create policy "Users can delete their own lists"
  on public.army_lists for delete
  using (auth.uid() = user_id);
