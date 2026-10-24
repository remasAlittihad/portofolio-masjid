-- ============================================================
-- Migrasi Program Kerja untuk Dashboard Admin
-- Jalankan file ini di Supabase SQL Editor.
-- Aman dijalankan berulang kali.
-- ============================================================

create extension if not exists "pgcrypto";

-- Tabel program kerja
create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null
              check (category in ('Keagamaan', 'Sosial', 'Pelatihan', 'Olahraga')),
  date        date not null,
  status      text not null default 'Akan Datang'
              check (status in ('Akan Datang', 'Berlangsung', 'Selesai')),
  location    text not null default '',
  created_at  timestamptz not null default now()
);

comment on table public.programs is 'Program kerja / rencana kegiatan IRMA';

-- Row Level Security
alter table public.programs enable row level security;

-- Publik boleh membaca program kerja
 drop policy if exists "programs public read" on public.programs;
create policy "programs public read"
on public.programs
for select
using (true);

-- Admin yang sudah login boleh tambah, edit, dan hapus
 drop policy if exists "programs admin all" on public.programs;
create policy "programs admin all"
on public.programs
for all
 to authenticated
using (true)
with check (true);

-- Index untuk pengurutan berdasarkan tanggal
create index if not exists programs_date_idx
on public.programs (date desc);

-- Data awal program kerja. ON CONFLICT mencegah duplikasi berdasarkan judul.
insert into public.programs
  (title, description, category, date, status, location)
values
  (
    'Kajian Pemuda Mingguan',
    'Kajian rutin setiap Minggu pagi bersama pembina untuk memperkuat keimanan dan akhlak pemuda.',
    'Keagamaan', '2026-10-25', 'Berlangsung', 'Masjid Al-Ittihad'
  ),
  (
    'Tadarus & Halaqah Ramadhan',
    'Program tadarus Al-Qur’an dan halaqah selama bulan Ramadhan dengan target khatam 30 juz.',
    'Keagamaan', '2027-02-18', 'Akan Datang', 'Masjid Al-Ittihad — Serambi Utama'
  ),
  (
    'Bakti Sosial Lingkungan',
    'Kerja bakti dan bersih-bersih lingkungan bersama warga sekitar masjid.',
    'Sosial', '2026-11-08', 'Akan Datang', 'Lingkungan Masjid Al-Ittihad'
  ),
  (
    'Pelatihan Kepemimpinan Kader',
    'Workshop leadership, public speaking, dan manajemen organisasi untuk kader IRMA.',
    'Pelatihan', '2026-11-22', 'Akan Datang', 'Aula Serbaguna Masjid'
  ),
  (
    'Turnamen Futsal Antar Seksi',
    'Kompetisi futsal internal untuk mempererat silaturahmi seluruh seksi IRMA.',
    'Olahraga', '2026-11-15', 'Akan Datang', 'Lapangan Futsal Al-Ittihad'
  )
on conflict do nothing;

-- Tambahkan data program lama yang belum termasuk pada seed awal.
-- Pengecekan judul mencegah data ganda jika query dijalankan ulang.
insert into public.programs (title, description, category, date, status, location)
select v.title, v.description, v.category, v.date::date, v.status, v.location
from (values
  ('Santunan Anak Yatim', 'Pengumpulan dan penyaluran infaq untuk santunan anak yatim serta dhuafa di sekitar masjid.', 'Sosial', '2026-09-20', 'Selesai', 'Aula Masjid Al-Ittihad'),
  ('Kelas Digital & Desain Grafis', 'Pelatihan desain grafis dan content creation untuk mendukung media dakwah IRMA.', 'Pelatihan', '2026-10-10', 'Selesai', 'Ruang Multimedia'),
  ('Senam Sehat Jemaah', 'Senam pagi bersama seluruh jemaah masjid sebagai bentuk gaya hidup sehat umat.', 'Olahraga', '2026-10-17', 'Berlangsung', 'Halaman Masjid Al-Ittihad'),
  ('PhBI Peringatan Hari Besar Islam', 'Perayaan Hari Besar Islam dengan lomba, pameran, dan kegiatan edukatif untuk keluarga besar.', 'Keagamaan', '2026-12-06', 'Akan Datang', 'Kompleks Masjid Al-Ittihad'),
  ('Buka Puasa Bersama & Piknik Dakwah', 'Silaturahmi kegiatan buka puasa bersama dan outbond kecil anggota IRMA.', 'Sosial', '2026-08-15', 'Selesai', 'Taman Kota')
) as v(title, description, category, date, status, location)
where not exists (
  select 1 from public.programs p where p.title = v.title
);

-- Verifikasi data setelah query selesai
select id, title, category, date, status, location
from public.programs
order by date desc;
