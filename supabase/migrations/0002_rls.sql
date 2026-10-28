-- ============================================================================
-- Row Level Security + secure RPC functions
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on every table
-- ---------------------------------------------------------------------------
alter table public.categories            enable row level security;
alter table public.products              enable row level security;
alter table public.customers             enable row level security;
alter table public.orders                enable row level security;
alter table public.order_items           enable row level security;
alter table public.inventory_movements   enable row level security;
alter table public.profiles              enable row level security;
alter table public.admin_activity_log    enable row level security;
alter table public.settings              enable row level security;

-- ---------------------------------------------------------------------------
-- categories — public read, staff write, admin delete
-- ---------------------------------------------------------------------------
create policy categories_select_public on public.categories
  for select using (true);
create policy categories_insert_staff on public.categories
  for insert with check (public.is_staff());
create policy categories_update_staff on public.categories
  for update using (public.is_staff()) with check (public.is_staff());
create policy categories_delete_admin on public.categories
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- products — public sees only active; staff sees all and manages
-- ---------------------------------------------------------------------------
create policy products_select_public on public.products
  for select using (status = 'active');
create policy products_select_staff on public.products
  for select using (public.is_staff());
create policy products_insert_staff on public.products
  for insert with check (public.is_staff());
create policy products_update_staff on public.products
  for update using (public.is_staff()) with check (public.is_staff());
create policy products_delete_admin on public.products
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- customers — staff only (privacy); rows created via place_order() RPC
-- ---------------------------------------------------------------------------
create policy customers_select_staff on public.customers
  for select using (public.is_staff());
create policy customers_insert_staff on public.customers
  for insert with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- orders / order_items — staff read; status updates by staff; creation via RPC
-- ---------------------------------------------------------------------------
create policy orders_select_staff on public.orders
  for select using (public.is_staff());
create policy orders_update_staff on public.orders
  for update using (public.is_staff()) with check (public.is_staff());

create policy order_items_select_staff on public.order_items
  for select using (public.is_staff());

-- ---------------------------------------------------------------------------
-- inventory_movements — staff read + write (audit)
-- ---------------------------------------------------------------------------
create policy inventory_select_staff on public.inventory_movements
  for select using (public.is_staff());
create policy inventory_insert_staff on public.inventory_movements
  for insert with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- profiles — read own or staff; users may update their own name only; role
-- changes require admin. No self-insert (handled by auth trigger).
-- ---------------------------------------------------------------------------
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_staff());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin());

-- ---------------------------------------------------------------------------
-- admin_activity_log — staff read + write (audit)
-- ---------------------------------------------------------------------------
create policy activity_select_staff on public.admin_activity_log
  for select using (public.is_staff());
create policy activity_insert_staff on public.admin_activity_log
  for insert with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- settings — public read (non-secret store config), staff write
-- ---------------------------------------------------------------------------
create policy settings_select_public on public.settings
  for select using (true);
create policy settings_insert_staff on public.settings
  for insert with check (public.is_staff());
create policy settings_update_staff on public.settings
  for update using (public.is_staff()) with check (public.is_staff());
create policy settings_delete_admin on public.settings
  for delete using (public.is_admin());

-- ============================================================================
-- Secure RPC: atomic stock adjustment (staff only)
-- ============================================================================
create or replace function public.adjust_stock(
  p_slug text,
  p_delta integer,
  p_reason text,
  p_reference text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_stock integer;
  v_type text;
  v_name text;
begin
  if not public.is_staff() then
    raise exception 'Tidak diizinkan: membutuhkan peran staf/admin';
  end if;
  if p_reason is null or length(trim(p_reason)) = 0 then
    raise exception 'Alasan penyesuaian stok wajib diisi';
  end if;
  if p_delta = 0 then
    raise exception 'Penyesuaian stok harus bukan nol';
  end if;

  v_type := case when p_delta > 0 then 'in' when p_delta < 0 then 'out' else 'adjustment' end;

  select name into v_name from public.products where slug = p_slug;
  if v_name is null then
    raise exception 'Produk tidak ditemukan';
  end if;

  update public.products
     set stock = stock + p_delta
   where slug = p_slug
     and (stock + p_delta) >= 0
  returning stock into v_new_stock;

  if not found then
    raise exception 'Penyesuaian ditolak: stok tidak boleh negatif';
  end if;

  insert into public.inventory_movements (product_slug, product_name, type, quantity, reason, reference, created_by)
  values (p_slug, v_name, v_type, abs(p_delta), trim(p_reason), p_reference, auth.uid());

  return v_new_stock;
end;
$$;

-- ============================================================================
-- Secure RPC: place an order atomically (guest checkout)
-- Validates payload, creates customer + order + items, decrements stock and
-- records inventory movements in a single transaction. Public callers cannot
-- bypass validation or write arbitrary rows directly.
-- ============================================================================
create or replace function public.place_order(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_customer_id uuid;
  item jsonb;
  v_product public.products%rowtype;
  v_multiplier integer;
  v_base_qty integer;
  v_unit_price integer;
  v_line_total integer;
  v_order_number text;
begin
  v_order_number := nullif(payload->>'order_number', '');
  if v_order_number is null then
    raise exception 'Nomor pesanan wajib diisi';
  end if;
  if coalesce(jsonb_array_length(payload->'items'), 0) = 0 then
    raise exception 'Pesanan tidak memiliki item';
  end if;

  -- customer snapshot from payload (required)
  if nullif(payload->'customer'->>'name', '') is null then
    raise exception 'Data pelanggan tidak lengkap';
  end if;

  insert into public.customers (name, phone, email, address, city, postal_code)
  values (
    payload->'customer'->>'name',
    nullif(payload->'customer'->>'phone', ''),
    nullif(payload->'customer'->>'email', ''),
    payload->'customer'->>'address',
    payload->'customer'->>'city',
    payload->'customer'->>'postal_code'
  )
  returning id into v_customer_id;

  insert into public.orders (
    order_number, customer_id, status, payment_status,
    subtotal, shipping_cost, discount, total,
    shipping_name, payment_name,
    customer_name, customer_phone, customer_address, customer_city, customer_postal_code, note
  )
  values (
    v_order_number, v_customer_id, 'pending', 'unpaid',
    coalesce((payload->>'subtotal')::integer, 0),
    coalesce((payload->>'shipping_cost')::integer, 0),
    0,
    coalesce((payload->>'total')::integer, 0),
    payload->>'shipping_name',
    payload->>'payment_name',
    payload->'customer'->>'name',
    payload->'customer'->>'phone',
    payload->'customer'->>'address',
    payload->'customer'->>'city',
    payload->'customer'->>'postal_code',
    payload->'customer'->>'note'
  )
  returning id into v_order_id;

  for item in select * from jsonb_array_elements(payload->'items')
  loop
    select * into v_product from public.products where slug = item->>'slug';
    if not found then
      raise exception 'Produk "%" tidak ditemukan', item->>'slug';
    end if;

    -- resolve multiplier from the product's own option list (never client-supplied)
    select coalesce((o->>'multiplier')::integer, 1) into v_multiplier
    from jsonb_array_elements(coalesce(v_product.options, '[]'::jsonb)) o
    where o->>'label' = item->>'option';
    v_multiplier := coalesce(v_multiplier, 1);

    v_base_qty := coalesce((item->>'quantity')::integer, 0) * v_multiplier;
    if v_base_qty <= 0 then
      raise exception 'Jumlah item tidak valid';
    end if;

    -- atomic, concurrency-safe stock decrement
    update public.products
       set stock = stock - v_base_qty
     where slug = v_product.slug
       and stock >= v_base_qty;
    if not found then
      raise exception 'Stok "%" tidak mencukupi (butuh %, tersedia %)',
        v_product.name, v_base_qty, v_product.stock;
    end if;

    v_unit_price := v_product.price * v_multiplier;
    v_line_total := v_unit_price * coalesce((item->>'quantity')::integer, 0);

    insert into public.order_items (order_id, product_slug, product_name, option_label, quantity, unit_price, line_total)
    values (v_order_id, v_product.slug, v_product.name, item->>'option', (item->>'quantity')::integer, v_unit_price, v_line_total);

    insert into public.inventory_movements (product_slug, product_name, type, quantity, reason, reference)
    values (v_product.slug, v_product.name, 'out', v_base_qty, 'Penjualan', v_order_number);
  end loop;

  return v_order_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.place_order(jsonb) to anon, authenticated;
grant execute on function public.adjust_stock(text, integer, text, text) to authenticated;
