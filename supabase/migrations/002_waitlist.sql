create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- RLS disabled; anon restricted to INSERT only via grants
grant insert on public.waitlist to anon;
