-- ============================================================================
-- Seed: catalog derived directly from lib/products.ts in the storefront.
-- Categories + products only (no fabricated orders/customers/stats).
-- ============================================================================

insert into public.categories (slug, name, tagline, image, tone) values
  ('bawang-merah', 'Bawang Merah', 'Segar langsung dari kebun', '/images/produk/bawang-super-philip.png', 'primary'),
  ('bibit',       'Bibit',        'Umbi & biji unggul siap tanam', '/images/produk/bibit-umbi.png', 'accent'),
  ('pupuk',       'Pupuk',        'Nutrisi tepat, panen melimpah', '/images/produk/pupuk-npk.png', 'card'),
  ('alat-tani',   'Alat Tani',    'Peralatan kuat untuk ladang', '/images/produk/sprayer.png', 'foreground')
on conflict (slug) do nothing;

insert into public.products (
  slug, sku, name, category, price, sale_price, unit, image, description,
  stock, options, badge, rating, sold, featured, status, created_at
) values
  (
    'bawang-merah-super-philip', 'TB-BM-001', 'Bawang Merah Super Philip', 'bawang-merah', 38000, null, 'kg',
    '/images/produk/bawang-super-philip.png',
    'Umbi besar, warna merah mengkilap, aroma kuat. Dipanen dari lahan dataran tinggi Enrekang dan dijemur alami.',
    850, '[{"label":"1 kg","multiplier":1},{"label":"5 kg","multiplier":5},{"label":"10 kg","multiplier":10}]'::jsonb,
    'Terlaris', 4.9, 2140, true, 'active', '2026-10-18'
  ),
  (
    'bawang-merah-bima-brebes', 'TB-BM-002', 'Bawang Merah Bima Brebes', 'bawang-merah', 35000, null, 'kg',
    '/images/produk/bawang-bima-brebes.png',
    'Varietas Bima Brebes ukuran sedang, rasa pedas khas, cocok untuk bumbu dapur dan bawang goreng.',
    620, '[{"label":"1 kg","multiplier":1},{"label":"5 kg","multiplier":5},{"label":"10 kg","multiplier":10}]'::jsonb,
    null, 4.8, 1385, true, 'active', '2026-10-10'
  ),
  (
    'bawang-merah-batu-ijo', 'TB-BM-003', 'Bawang Merah Batu Ijo Premium', 'bawang-merah', 42000, null, 'kg',
    '/images/produk/bawang-batu-ijo.png',
    'Grade premium, umbi padat dan tahan simpan lama. Pilihan utama restoran dan pedagang pasar.',
    310, '[{"label":"1 kg","multiplier":1},{"label":"5 kg","multiplier":5},{"label":"25 kg (karung)","multiplier":25}]'::jsonb,
    'Baru', 4.9, 412, false, 'active', '2026-10-22'
  ),
  (
    'bibit-umbi-bima-brebes', 'TB-BB-001', 'Bibit Umbi Bima Brebes', 'bibit', 48000, null, 'kg',
    '/images/produk/bibit-umbi.png',
    'Umbi bibit sudah melewati masa dormansi 60 hari, tunas mulai muncul. Daya tumbuh di atas 95%.',
    540, '[{"label":"1 kg","multiplier":1},{"label":"10 kg","multiplier":10},{"label":"50 kg","multiplier":50}]'::jsonb,
    'Terlaris', 4.9, 1870, true, 'active', '2026-10-05'
  ),
  (
    'bibit-umbi-super-philip', 'TB-BB-002', 'Bibit Umbi Super Philip', 'bibit', 52000, null, 'kg',
    '/images/produk/bibit-umbi.png',
    'Bibit Super Philip asli Enrekang, adaptif di dataran tinggi, potensi hasil 18–22 ton per hektar.',
    280, '[{"label":"1 kg","multiplier":1},{"label":"10 kg","multiplier":10},{"label":"50 kg","multiplier":50}]'::jsonb,
    null, 4.8, 964, false, 'active', '2026-09-28'
  ),
  (
    'bibit-semai-tajuk', 'TB-BB-003', 'Bibit Semai Tajuk (Tray)', 'bibit', 75000, null, 'tray',
    '/images/produk/bibit-semai.png',
    'Bibit semai umur 30 hari dalam tray isi 200 lubang. Akar kuat, siap pindah tanam ke bedengan.',
    95, '[{"label":"1 tray","multiplier":1},{"label":"5 tray","multiplier":5}]'::jsonb,
    'Baru', 4.7, 188, true, 'active', '2026-10-20'
  ),
  (
    'biji-tss-lokananta', 'TB-BB-004', 'Biji TSS Lokananta', 'bibit', 185000, null, 'pack',
    '/images/produk/biji-tss.png',
    'True Shallot Seed varietas Lokananta, isi 10 gram. Hemat biaya bibit hingga 40% dibanding umbi.',
    140, '[{"label":"1 pack","multiplier":1},{"label":"5 pack","multiplier":5}]'::jsonb,
    null, 4.6, 302, false, 'active', '2026-09-15'
  ),
  (
    'pupuk-npk-khusus-bawang', 'TB-PK-001', 'Pupuk NPK Khusus Bawang 25 kg', 'pupuk', 340000, null, 'sak',
    '/images/produk/pupuk-npk.png',
    'Formula NPK 16-16-16 plus sulfur untuk pembesaran umbi dan warna merah yang lebih pekat.',
    120, '[{"label":"1 sak","multiplier":1},{"label":"4 sak","multiplier":4}]'::jsonb,
    'Promo', 4.8, 756, true, 'active', '2026-10-01'
  ),
  (
    'pupuk-organik-kompos', 'TB-PK-002', 'Pupuk Organik Kompos 20 kg', 'pupuk', 65000, null, 'sak',
    '/images/produk/pupuk-organik.png',
    'Kompos matang dari kotoran ternak dan sisa tanaman. Menggemburkan tanah dan menjaga kelembapan.',
    210, '[{"label":"1 sak","multiplier":1},{"label":"5 sak","multiplier":5},{"label":"10 sak","multiplier":10}]'::jsonb,
    null, 4.7, 489, false, 'active', '2026-09-20'
  ),
  (
    'sprayer-elektrik-16l', 'TB-AT-001', 'Sprayer Elektrik 16 Liter', 'alat-tani', 385000, null, 'unit',
    '/images/produk/sprayer.png',
    'Tangki 16 L dengan pompa baterai 12V, tahan hingga 6 jam semprot. Nozzle bisa diatur kabut atau lurus.',
    34, '[{"label":"1 unit","multiplier":1}]'::jsonb,
    'Terlaris', 4.8, 241, true, 'active', '2026-09-30'
  ),
  (
    'mulsa-plastik-hitam-perak', 'TB-AT-002', 'Mulsa Plastik Hitam Perak', 'alat-tani', 620000, null, 'roll',
    '/images/produk/mulsa.png',
    'Lebar 120 cm, panjang 500 m. Menekan gulma, menjaga suhu tanah, dan mengurangi serangan hama.',
    48, '[{"label":"1 roll","multiplier":1}]'::jsonb,
    null, 4.7, 133, true, 'active', '2026-10-12'
  ),
  (
    'cangkul-baja-tempa', 'TB-AT-003', 'Cangkul Baja Tempa', 'alat-tani', 95000, null, 'unit',
    '/images/produk/cangkul.png',
    'Mata cangkul baja tempa tebal dengan gagang kayu jati. Kuat untuk membuat bedengan di tanah keras.',
    76, '[{"label":"1 unit","multiplier":1}]'::jsonb,
    null, 4.6, 198, false, 'active', '2026-09-08'
  ),
  (
    'gunting-panen-stainless', 'TB-AT-004', 'Gunting Panen Stainless', 'alat-tani', 45000, null, 'unit',
    '/images/produk/gunting-panen.png',
    'Gunting stainless anti karat dengan pegangan karet. Ringan dan tajam untuk memotong daun dan akar bawang.',
    0, '[{"label":"1 unit","multiplier":1}]'::jsonb,
    null, 4.5, 320, false, 'active', '2026-08-30'
  )
on conflict (slug) do nothing;
