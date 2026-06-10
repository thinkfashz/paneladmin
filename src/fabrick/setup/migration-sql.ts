// SQL de migracion inicial. Se ejecuta UNA vez en el SQL Editor de Supabase
// durante el asistente de primer inicio. Crea las tablas base del panel con
// RLS activado y sin policies publicas: solo el servidor (service role) accede.

export const REQUIRED_TABLES = [
  "businesses",
  "profiles",
  "business_settings",
  "activity_records",
  "demo_tokens",
] as const;

export const MIGRATION_SQL = `-- Fabrick Admin: migracion inicial (v1)
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  password_hash text not null,
  role text not null default 'admin',
  business_id uuid references public.businesses(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique references public.businesses(id) on delete cascade,
  brand jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_records (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  method text,
  user_id text,
  user_email text,
  business_id text,
  ip_hash text,
  ip_masked text,
  user_agent text,
  device_type text,
  browser_family text,
  os_family text,
  referer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_tokens (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  is_active boolean not null default true,
  visit_count integer not null default 0,
  max_visits integer not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_activity_records_created_at on public.activity_records (created_at desc);
create index if not exists idx_demo_tokens_token_hash on public.demo_tokens (token_hash);

-- RLS activado sin policies: el anon key NO puede leer ni escribir nada.
-- Solo el servidor del panel (service role key) tiene acceso.
alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.business_settings enable row level security;
alter table public.activity_records enable row level security;
alter table public.demo_tokens enable row level security;
`;
