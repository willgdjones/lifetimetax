-- LifetimeTax initial schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    hmrc_access_token_encrypted text,
    hmrc_refresh_token_encrypted text,
    hmrc_token_expires_at timestamptz,
    hmrc_nino_encrypted text,
    hmrc_match_id text,
    hmrc_connected_at timestamptz,
    is_premium boolean default false,
    stripe_payment_id text,
    premium_purchased_at timestamptz,
    share_id text unique default gen_random_uuid()::text,
    data_fetched_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.tax_years (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    tax_year text not null,
    income_tax_paid numeric(12, 2),
    ni_contributions numeric(12, 2),
    student_loan_repaid numeric(12, 2),
    total_earnings numeric(12, 2),
    employment_count integer,
    raw_data_encrypted jsonb,
    created_at timestamptz default now(),
    unique(user_id, tax_year)
);

create table if not exists public.lifetime_summary (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    total_income_tax numeric(14, 2),
    total_ni numeric(14, 2),
    estimated_vat numeric(14, 2),
    estimated_council_tax numeric(14, 2),
    estimated_fuel_duty numeric(14, 2),
    estimated_other numeric(14, 2),
    grand_total numeric(14, 2),
    years_covered integer,
    earliest_year text,
    latest_year text,
    calculated_at timestamptz default now(),
    unique(user_id)
);

create table if not exists public.share_cards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    card_type text not null,
    public_data jsonb not null,
    share_url text unique,
    view_count integer default 0,
    created_at timestamptz default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create or replace function public.increment_share_card_views(card_id uuid)
returns void
language sql
security definer
as $$
  update public.share_cards
  set view_count = coalesce(view_count, 0) + 1
  where id = card_id;
$$;

alter table public.profiles enable row level security;
alter table public.tax_years enable row level security;
alter table public.lifetime_summary enable row level security;
alter table public.share_cards enable row level security;

-- Profiles
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = id);

-- Tax years
drop policy if exists "Users can read own tax years" on public.tax_years;
create policy "Users can read own tax years" on public.tax_years for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own tax years" on public.tax_years;
create policy "Users can insert own tax years" on public.tax_years for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own tax years" on public.tax_years;
create policy "Users can update own tax years" on public.tax_years for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own tax years" on public.tax_years;
create policy "Users can delete own tax years" on public.tax_years for delete using (auth.uid() = user_id);

-- Lifetime summary
drop policy if exists "Users can read own summary" on public.lifetime_summary;
create policy "Users can read own summary" on public.lifetime_summary for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own summary" on public.lifetime_summary;
create policy "Users can insert own summary" on public.lifetime_summary for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own summary" on public.lifetime_summary;
create policy "Users can update own summary" on public.lifetime_summary for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own summary" on public.lifetime_summary;
create policy "Users can delete own summary" on public.lifetime_summary for delete using (auth.uid() = user_id);

-- Share cards
drop policy if exists "Share cards are publicly readable" on public.share_cards;
create policy "Share cards are publicly readable" on public.share_cards for select using (true);

drop policy if exists "Users can manage own cards" on public.share_cards;
create policy "Users can manage own cards" on public.share_cards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
