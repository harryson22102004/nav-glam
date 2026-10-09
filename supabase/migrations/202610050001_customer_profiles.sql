create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 20),
  campus_delivery_point text not null check (char_length(campus_delivery_point) between 3 and 160),
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;

grant select, insert, update on public.customer_profiles to authenticated;

drop policy if exists "Customers can read their own profile" on public.customer_profiles;
create policy "Customers can read their own profile"
  on public.customer_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Customers can create their own profile" on public.customer_profiles;
create policy "Customers can create their own profile"
  on public.customer_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Customers can update their own profile" on public.customer_profiles;
create policy "Customers can update their own profile"
  on public.customer_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
