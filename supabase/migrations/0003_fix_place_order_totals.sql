-- ============================================================================
-- Fix place_order(): compute subtotal/total server-side from database prices.
-- Client-supplied subtotal/total are ignored so amounts cannot be forged.
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
  v_quantity integer;
  v_unit_price integer;
  v_line_total integer;
  v_order_number text;
  v_subtotal integer := 0;
  v_shipping_cost integer := 0;
begin
  v_order_number := nullif(payload->>'order_number', '');
  if v_order_number is null then
    raise exception 'Nomor pesanan wajib diisi';
  end if;
  if coalesce(jsonb_array_length(payload->'items'), 0) = 0 then
    raise exception 'Pesanan tidak memiliki item';
  end if;
  if nullif(payload->'customer'->>'name', '') is null then
    raise exception 'Data pelanggan tidak lengkap';
  end if;

  v_shipping_cost := coalesce((payload->>'shipping_cost')::integer, 0);
  if v_shipping_cost < 0 then
    raise exception 'Ongkos kirim tidak valid';
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

  -- Insert order with placeholder amounts; totals are finalized below.
  insert into public.orders (
    order_number, customer_id, status, payment_status,
    subtotal, shipping_cost, discount, total,
    shipping_name, payment_name,
    customer_name, customer_phone, customer_address, customer_city, customer_postal_code, note
  )
  values (
    v_order_number, v_customer_id, 'pending', 'unpaid',
    0, v_shipping_cost, 0, 0,
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

    v_quantity := coalesce((item->>'quantity')::integer, 0);
    v_base_qty := v_quantity * v_multiplier;
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
    v_line_total := v_unit_price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;

    insert into public.order_items (order_id, product_slug, product_name, option_label, quantity, unit_price, line_total)
    values (v_order_id, v_product.slug, v_product.name, item->>'option', v_quantity, v_unit_price, v_line_total);

    insert into public.inventory_movements (product_slug, product_name, type, quantity, reason, reference)
    values (v_product.slug, v_product.name, 'out', v_base_qty, 'Penjualan', v_order_number);
  end loop;

  -- Finalize authoritative totals.
  update public.orders
     set subtotal = v_subtotal,
         total = v_subtotal + v_shipping_cost
   where id = v_order_id;

  return v_order_id;
end;
$$;
