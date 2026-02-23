-- Create the products table
create table products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  price numeric default 0,
  stock_status text check (stock_status in ('in_stock', 'made_to_order', 'out_of_stock')) default 'in_stock',
  stock_quantity integer default 0,
  images text[],
  original_url text unique, -- Added unique constraint for upsert
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;

-- Create a policy that allows anyone to view products
create policy "Allow public read access"
  on products
  for select
  using (true);

-- Create a policy that allows authenticated users (and service roles) to insert/update
create policy "Allow authenticated insert/update"
  on products
  for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');
