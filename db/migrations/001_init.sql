-- Initial schema for Imam Marble & Tiles
-- Run this in your Supabase SQL editor or via psql connected to the project's DB

create table if not exists roles (
  id serial primary key,
  name text not null unique
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  role_id int references roles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id serial primary key,
  name text not null unique,
  slug text not null unique
);

create table if not exists brands (
  id serial primary key,
  name text not null unique
);

create table if not exists products (
  id serial primary key,
  name text not null,
  category_id int references categories(id),
  brand_id int references brands(id),
  size text,
  finish text,
  color text,
  material text,
  description text,
  price numeric(12,2) default 0,
  stock int default 0,
  featured boolean default false,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_name_idx on products using gin (to_tsvector('simple', coalesce(name,'')));

create table if not exists product_images (
  id serial primary key,
  product_id int references products(id) on delete cascade,
  storage_path text not null,
  is_primary boolean default false,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id serial primary key,
  user_id uuid references profiles(id),
  name text,
  email text,
  phone text,
  message text,
  type text,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists enquiry_images (
  id serial primary key,
  enquiry_id int references enquiries(id) on delete cascade,
  storage_path text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists admin_replies (
  id serial primary key,
  enquiry_id int references enquiries(id) on delete cascade,
  admin_id uuid references profiles(id),
  message text,
  outcome text,
  created_at timestamptz default now()
);

create table if not exists wishlists (
  id serial primary key,
  user_id uuid references profiles(id),
  product_id int references products(id),
  created_at timestamptz default now()
);

create table if not exists contact_messages (
  id serial primary key,
  name text,
  email text,
  phone text,
  subject text,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

-- Seed minimal roles
insert into roles (name) values ('admin') on conflict do nothing;
insert into roles (name) values ('customer') on conflict do nothing;
