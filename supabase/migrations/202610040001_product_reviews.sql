create table if not exists public.review_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  reviewer_name text not null check (char_length(reviewer_name) between 2 and 60),
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 3 and 100),
  body text not null check (char_length(body) between 10 and 1200),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_approved_product_date_idx
  on public.product_reviews (product_slug, created_at desc)
  where status = 'approved';

create index if not exists product_reviews_pending_date_idx
  on public.product_reviews (created_at asc)
  where status = 'pending';

create or replace function public.is_review_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.review_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_review_admin() from public;
grant execute on function public.is_review_admin() to anon, authenticated;

alter table public.review_admins enable row level security;
alter table public.product_reviews enable row level security;

grant select on public.review_admins to authenticated;
grant select, insert, update on public.product_reviews to anon, authenticated;

drop policy if exists "Review admins can read their own membership" on public.review_admins;
create policy "Review admins can read their own membership"
  on public.review_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Anyone can read approved reviews" on public.product_reviews;
create policy "Anyone can read approved reviews"
  on public.product_reviews for select to anon, authenticated
  using (status = 'approved' or (select public.is_review_admin()));

drop policy if exists "Anyone can submit pending reviews" on public.product_reviews;
create policy "Anyone can submit pending reviews"
  on public.product_reviews for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Review admins can moderate reviews" on public.product_reviews;
create policy "Review admins can moderate reviews"
  on public.product_reviews for update to authenticated
  using ((select public.is_review_admin()))
  with check ((select public.is_review_admin()));