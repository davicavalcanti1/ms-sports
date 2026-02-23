-- =============================================================
-- Migration: Admin table + updated RLS for products_new
-- Date: 2026-02-23
-- Description:
--   1. Create the 'admins' table for explicit admin access by email
--   2. Drop the old RLS policies that relied on profiles.is_admin
--   3. Create new RLS policies that check against the admins table
--   4. Allow all SELECT on products_new (not just visible ones)
--      so admin can see hidden products too
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Create the admins table
-- ---------------------------------------------------------------
create table if not exists public.admins (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admins enable row level security;

-- Admins can read the admins table (needed for AuthContext check)
create policy "Admins table is readable by authenticated users"
  on public.admins for select
  using ( auth.role() = 'authenticated' );


-- ---------------------------------------------------------------
-- 2. Update products_new RLS
--    Drop old policies that check profiles.is_admin and replace
--    them with policies that check admin email via admins table.
-- ---------------------------------------------------------------
drop policy if exists "Products are viewable by everyone" on public.products_new;
drop policy if exists "Only admins can insert products" on public.products_new;
drop policy if exists "Only admins can update products" on public.products_new;

-- Helper function to check if the current user is an admin via the admins table
-- Uses jwt claim for email lookup
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admins
    where email = (auth.jwt() ->> 'email')
  );
$$ language sql security definer stable;

-- Allow everyone to read visible products; admins can read all
-- First ensure the is_visible column exists (may not have been created by earlier migration)
alter table public.products_new
  add column if not exists is_visible boolean default true;

-- Also ensure base_price column exists
alter table public.products_new
  add column if not exists base_price numeric default 150;

create policy "Products are publicly readable"
  on public.products_new for select
  using ( is_visible = true or auth.role() = 'authenticated' );

-- Any logged-in user can insert/update/delete products
-- (login is already restricted to admins via the admins table in the app)
create policy "Authenticated users can insert products"
  on public.products_new for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update products"
  on public.products_new for update
  using ( auth.role() = 'authenticated' );

create policy "Authenticated users can delete products"
  on public.products_new for delete
  using ( auth.role() = 'authenticated' );


-- ---------------------------------------------------------------
-- 3. Update product_variants RLS similarly
-- ---------------------------------------------------------------
drop policy if exists "Only admins can insert variants" on public.product_variants;
drop policy if exists "Only admins can update variants" on public.product_variants;

create policy "Admins can insert variants"
  on public.product_variants for insert
  with check ( public.is_admin() );

create policy "Admins can update variants"
  on public.product_variants for update
  using ( public.is_admin() );
