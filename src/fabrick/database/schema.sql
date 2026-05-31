-- Fabrick Admin - Initial Database Schema
-- Target principal: Supabase/Postgres.
-- PocketBase e InsForge se conectarán mediante adaptadores.

create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'generic',
  status text not null default 'demo',
  owner_user_id uuid,
  demo_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  business_id uuid references public.businesses(id) on delete set null,
  full_name text,
  role text not null default 'business_owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  logo_url text,
  primary_color text default '#111827',
  secondary_color text default '#f97316',
  background_color text default '#ffffff',
  text_color text default '#111827',
  whatsapp text,
  email text,
  address text,
  opening_hours text,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id)
);

create table if not exists public.demo_tokens (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  max_visits integer,
  visit_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  image_url text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null default 0,
  duration_minutes integer default 60,
  image_url text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  source text,
  status text default 'new',
  tags text[] default '{}',
  last_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'pending',
  total numeric(12,2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  quote_number text,
  status text not null default 'draft',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  provider text not null,
  name text not null,
  public_config jsonb not null default '{}'::jsonb,
  encrypted_secret text,
  status text not null default 'not_configured',
  last_tested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_businesses_slug on public.businesses(slug);
create index if not exists idx_products_business_id on public.products(business_id);
create index if not exists idx_services_business_id on public.services(business_id);
create index if not exists idx_customers_business_id on public.customers(business_id);
create index if not exists idx_appointments_business_id on public.appointments(business_id);
create index if not exists idx_orders_business_id on public.orders(business_id);
create index if not exists idx_quotes_business_id on public.quotes(business_id);
