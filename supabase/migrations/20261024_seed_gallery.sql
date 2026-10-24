-- ============================================================
-- IRMA Al-Ittihad — Seed data galeri
-- Isi tabel `public.gallery` dengan 12 item contoh
-- (sama dengan MOCK_GALLERY di src/lib/mockData.ts).
--
-- Jalankan di Supabase SQL Editor. Aman dijalankan berulang
-- (idempoten) karena memakai uuid tetap + on conflict do nothing.
--
-- Setelah dijalankan, foto asli bisa diunggah/diubah lewat
-- halaman /admin → tab Galeri → "Tambah Galeri".
-- ============================================================

insert into public.gallery (id, title, image_url, category, date) values
  ('a1000000-0000-4000-8000-000000000001', 'PhBI Hari Besar Islam',
   'https://picsum.photos/seed/phbi1/900/700', 'PhBI', '2026-07-26'),
  ('a1000000-0000-4000-8000-000000000002', 'Bakti Sosial Warga Sekitar',
   'https://picsum.photos/seed/baksos2/900/700', 'Bakti Sosial', '2026-08-02'),
  ('a1000000-0000-4000-8000-000000000003', 'Kelompok Kajian Pemuda',
   'https://picsum.photos/seed/kajian3/900/700', 'Study Group', '2026-08-09'),
  ('a1000000-0000-4000-8000-000000000004', 'Camping Dakwah Pemuda',
   'https://picsum.photos/seed/camping4/900/700', 'Camping', '2026-08-23'),
  ('a1000000-0000-4000-8000-000000000005', 'Santunan Anak Yatim',
   'https://picsum.photos/seed/santunan5/900/700', 'Bakti Sosial', '2026-09-20'),
  ('a1000000-0000-4000-8000-000000000006', 'Tadarus Bulan Suci',
   'https://picsum.photos/seed/tadarus6/900/700', 'PhBI', '2026-06-12'),
  ('a1000000-0000-4000-8000-000000000007', 'Diskusi Kader Muda',
   'https://picsum.photos/seed/kader7/900/700', 'Study Group', '2026-09-05'),
  ('a1000000-0000-4000-8000-000000000008', 'Outbond Keakraban Anggota',
   'https://picsum.photos/seed/outbond8/900/700', 'Camping', '2026-07-05'),
  ('a1000000-0000-4000-8000-000000000009', 'Lomba PhBI Anak Shalih',
   'https://picsum.photos/seed/lomba9/900/700', 'PhBI', '2026-05-24'),
  ('a1000000-0000-4000-8000-000000000010', 'Aksi Kebersihan Sungai',
   'https://picsum.photos/seed/sungai10/900/700', 'Bakti Sosial', '2026-04-18'),
  ('a1000000-0000-4000-8000-000000000011', 'Kajian Akhir Pekan',
   'https://picsum.photos/seed/kajian11/900/700', 'Study Group', '2026-03-14'),
  ('a1000000-0000-4000-8000-000000000012', 'Api Unggun Pemuda',
   'https://picsum.photos/seed/unggun12/900/700', 'Camping', '2026-02-28')
on conflict (id) do nothing;

-- Verifikasi
select id, title, category, date, image_url
from public.gallery
order by date desc;
