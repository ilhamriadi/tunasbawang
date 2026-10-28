# Tunas Bawang Store — Toko Online + Panel Admin

Toko online Tunas Bawang (bawang merah, bibit, pupuk, alat tani) dari Enrekang,
Sulawesi Selatan — dengan panel admin produksi berbasis **Next.js App Router +
Supabase**.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
- pnpm · shadcn/ui (Base UI) · Lucide · Recharts · React Hook Form + Zod
- Supabase (PostgreSQL + Auth + RLS) · `@supabase/supabase-js` · `@supabase/ssr`
- Deploy target: Vercel

## Struktur

```
app/
  (store)/          # Storefront publik (home, /produk, /produk/[slug], /checkout)
  admin/            # Panel admin (theme + providers)
    login/          # /admin/login
    (dashboard)/    # Shell autentikasi (sidebar + header)
      page.tsx          # /admin (Dashboard)
      products/         # /admin/products (+ new, [slug])
      categories/       # /admin/categories
      orders/           # /admin/orders (+ [id])
      inventory/        # /admin/inventory
      customers/        # /admin/customers (+ [id])
      reports/          # /admin/reports (+ /admin/reports/export CSV)
      settings/         # /admin/settings (+ users)
lib/
  supabase/         # client / server / admin / middleware
  data/             # data-access layer (Supabase queries)
  actions/          # server actions (auth + validation + audit log)
  validators.ts     # Zod schemas
  constants.ts      # statuses/labels
supabase/
  migrations/       # schema + RLS + secure RPC (version-controlled SQL)
  seed.sql          # katalog awal (dari data storefront)
```

## Setup lokal

1. Instal dependensi:

   ```bash
   pnpm install
   ```

2. Jalankan Supabase lokal (butuh Docker) dan ambil kuncinya:

   ```bash
   supabase start          # migrasi + seed otomatis diterapkan
   supabase status -o env  # salin ANON_KEY & SERVICE_ROLE_KEY
   ```

3. Buat `.env.local` (contoh di `.env.example`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
   SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
   ```

4. Jalankan dev server:

   ```bash
   pnpm dev
   ```

   - Storefront: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Akun admin pertama

Supabase Auth lokal tidak mengirim email sungguhan (tertampung di Mailpit
http://127.0.0.1:54324). Untuk membuat admin pertama:

```bash
supabase functions serve # tidak wajib
```

Atau, buat user lalu promosikan perannya langsung ke database:

```sql
-- via `supabase db reset` lalu psql, atau Studio http://127.0.0.1:54323
insert into auth.users (...) ; -- (gunakan Dashboard/CLI Auth)
update public.profiles set role = 'admin' where id = '<user-id>';
```

Setelah ada satu admin, admin bisa menambah admin/staf lain lewat
`/admin/settings/users` (kata sandi sementara ditampilkan sekali).

## Migrasi & seed

```bash
supabase db reset        # drop & terapkan ulang semua migrasi + seed
supabase migration new <nama>   # buat migrasi baru
supabase db push         # terapkan migrasi ke proyek Supabase (hosted)
```

Skema utama (lihat `supabase/migrations/`): `categories`, `products`, `customers`,
`orders`, `order_items`, `inventory_movements`, `profiles`, `admin_activity_log`,
`settings`. Fungsi aman (security definer): `is_admin`, `is_staff`, `place_order`,
`adjust_stock`.

## Keamanan

- Semua route `/admin` dilindungi middleware + `requireStaff()` di server layout.
- RLS aktif di semua tabel. Pembaca publik hanya melihat produk aktif; mutasi
  dibatasi ke staf/admin lewat `is_staff()`/`is_admin()`.
- Peran (`profiles.role`) ditentukan oleh trigger auth, bukan input klien.
- `place_order` menghitung subtotal/total dari harga database (bukan input klien)
  dan menurunkan stok secara atomik dalam satu transaksi.
- `adjust_stock` menolak stok negatif dan mencatat pergerakan + alasan.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server (file `lib/supabase/admin.ts`
  di-`server-only`); tidak pernah di variabel `NEXT_PUBLIC_*`.

## Deployment (Vercel + Supabase)

1. Push repo ke GitHub dan hubungkan ke Vercel (auto-deploy dari branch `main`).
2. Di Supabase, terapkan migrasi + seed ke proyek hosted:

   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```

3. Di Vercel → Settings → Environment Variables, atur untuk Production & Preview:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role key>
   ```

4. Build otomatis dari Vercel menjalankan `next build`. Verifikasi login, RLS,
   dan pemuatan data setelah deploy.

> Deploy dinyatakan selesai hanya setelah build berhasil di Vercel dan
> endpoint produksi diverifikasi (login, akses data, redirect auth).

## Scripts

```bash
pnpm dev     # dev server
pnpm build   # production build
pnpm start   # start produksi
```
