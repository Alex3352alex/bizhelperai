-- ============================================================
-- BizHelper AI — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE / DROP POLICY IF EXISTS).
-- ============================================================

-- 1) Profiles table -------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  username text,
  created_at timestamptz not null default now(),

  -- Subscription
  current_plan text not null default 'free',          -- free | basic | pro | business
  paypal_subscription_id text,
  subscription_status text,                            -- ACTIVE | CANCELLED | SUSPENDED | EXPIRED
  subscription_started_at timestamptz,
  subscription_renews_at timestamptz,

  -- Usage (monthly rolling window)
  generations_used integer not null default 0,
  usage_period_start timestamptz not null default now()
);

-- 2) Auto-create a profile row whenever a user signs up -------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Row Level Security ---------------------------------------------
alter table public.profiles enable row level security;

-- Users can read their own profile
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (e.g. username)
drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Note: the PayPal webhook updates plans using the SERVICE ROLE key,
-- which bypasses RLS — so no public insert/update policy is needed for that.
