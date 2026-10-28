-- ============================================================================
-- Tunas Bawang Store — initial schema
-- Derived from the storefront data models (lib/products.ts, lib/checkout.ts,
-- lib/format.ts) plus the minimum missing functionality for an admin panel:
-- orders, customers, inventory movements, admin profiles, activity log, settings.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper role functions (security definer). These are the single source of
-- truth for authorization inside RLS policies.
-- ---------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
end;
$$;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table public.categories (
  slug        text primary key,
  name        text not null,
  tagline     text,
  image       text,
  tone        text not null default 'primary'
              check (tone in ('primary', 'accent', 'card', 'foreground')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products (extends the storefront Product type with sku, sale_price, status)
-- ---------------------------------------------------------------------------
create table public.products (
  slug        text primary key,
  sku         text not null unique,
  name        text not null,
  category    text not null references public.categories(slug) on delete restrict,
  price       integer not null check (price >= 0),
  sale_price  integer check (sale_price is null or sale_price >= 0),
  unit        text not null,
  image       text,
  description text,
  stock       integer not null default 0 check (stock >= 0),
  options     jsonb not null default '[]'::jsonb,
  badge       text check (badge in ('Terlaris', 'Baru', 'Promo')),
  rating      numeric(2,1) not null default 0,
  sold        integer not null default 0,
  featured    boolean not null default false,
  status      text not null default 'active'
              check (status in ('active', 'draft', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index products_category_idx on public.products (category);
create index products_status_idx on public.products (status);

-- ---------------------------------------------------------------------------
-- Customers (guest checkout + optional auth link)
-- ---------------------------------------------------------------------------
create table public.customers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  name        text not null,
  phone       text,
  email       text,
  address     text,
  city        text,
  postal_code text,
  created_at  timestamptz not null default now()
);

create index customers_phone_idx on public.customers (phone);
create index customers_name_idx on public.customers (name);

-- ---------------------------------------------------------------------------
-- Orders
--   status          -> fulfillment state (independent of payment)
--   payment_status  -> payment state (never implied by fulfillment updates)
-- ---------------------------------------------------------------------------
create table public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_number        text not null unique,
  customer_id         uuid references public.customers(id) on delete set null,
  status              text not null default 'pending'
                      check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status      text not null default 'unpaid'
                      check (payment_status in ('unpaid', 'paid', 'refunded')),
  subtotal            integer not null check (subtotal >= 0),
  shipping_cost       integer not null default 0 check (shipping_cost >= 0),
  discount            integer not null default 0 check (discount >= 0),
  total               integer not null check (total >= 0),
  shipping_name       text,
  payment_name        text,
  -- customer snapshot (preserved even if the customer row changes later)
  customer_name       text,
  customer_phone      text,
  customer_address    text,
  customer_city       text,
  customer_postal_code text,
  note                text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status);
create index orders_payment_status_idx on public.orders (payment_status);

-- ---------------------------------------------------------------------------
-- Order items
-- ---------------------------------------------------------------------------
create table public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_slug text references public.products(slug) on delete set null,
  product_name text not null,
  option_label text,
  quantity     integer not null check (quantity > 0),
  unit_price   integer not null check (unit_price >= 0),
  line_total   integer not null check (line_total >= 0)
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_slug_idx on public.order_items (product_slug);

-- ---------------------------------------------------------------------------
-- Inventory movements (audit trail)
-- ---------------------------------------------------------------------------
create table public.inventory_movements (
  id           uuid primary key default gen_random_uuid(),
  product_slug text references public.products(slug) on delete set null,
  product_name text not null,
  type         text not null check (type in ('in', 'out', 'adjustment')),
  quantity     integer not null check (quantity >= 0),
  reason       text not null,
  reference    text,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index inventory_movements_product_idx on public.inventory_movements (product_slug);
create index inventory_movements_created_at_idx on public.inventory_movements (created_at desc);

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user; role is the authorization source of truth)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'staff' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admin activity log (audit)
-- ---------------------------------------------------------------------------
create table public.admin_activity_log (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users(id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   text,
  detail      jsonb,
  created_at  timestamptz not null default now()
);

create index admin_activity_log_created_at_idx on public.admin_activity_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Store settings (non-secret, key/value; server secrets must never live here)
-- ---------------------------------------------------------------------------
create table public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- Create a profile row (role 'staff' by default — never trust client input for
-- role) whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
