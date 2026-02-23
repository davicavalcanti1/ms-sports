-- Create Profiles table for Admins & Users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create new Products table tailored to the new categories and logic
create table public.products_new (
  id text primary key, -- Use 'yupoo-X' id from local json to sync easily
  title text not null,
  description text,
  category text, -- Brasileiros, Europeus, America do Norte, Asia, Africa, Selecoes, Retro
  team text, -- Sub-filter (e.g. Flamengo, Real Madrid)
  base_price numeric default 0 not null,
  images text[] default '{}',
  is_visible boolean default true, -- Allows admin to hide specific products
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products_new enable row level security;

create policy "Products are viewable by everyone"
  on products_new for select
  using ( is_visible = true or (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)) );

create policy "Only admins can insert products"
  on products_new for insert
  with check ( 
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

create policy "Only admins can update products"
  on products_new for update
  using ( 
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

-- Create Product Variants table (Sizes: PP, P, M, G, GG, XGG)
create table public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products_new(id) on delete cascade not null,
  size text not null check (size in ('PP', 'P', 'M', 'G', 'GG', 'XGG', 'UNIQUE')),
  stock_quantity integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, size) -- A product can only have one row per size
);

alter table public.product_variants enable row level security;

create policy "Variants are viewable by everyone"
  on product_variants for select
  using ( true );

create policy "Only admins can insert variants"
  on product_variants for insert
  with check ( 
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

create policy "Only admins can update variants"
  on product_variants for update
  using ( 
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
