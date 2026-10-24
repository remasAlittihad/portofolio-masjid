-- ============================================================
-- IRMA Al-Ittihad — Supabase schema
-- Tables: members, executives, programs, gallery, financial_logs, quotes
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- ============================================================

-- ------------------------------------------------------------
-- 0. Registration / member submissions
-- ------------------------------------------------------------
create table if not exists public.members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  age        integer not null check (age > 0),
  phone      text not null,
  motivation text not null,
  created_at timestamptz not null default now()
);

alter table public.members enable row level security;
drop policy if exists "members public insert" on public.members;
create policy "members public insert" on public.members
  for insert to anon, authenticated with check (true);

comment on table public.members is 'Data pendaftaran anggota IRMA dari formulir WhatsApp';

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Management / Organization structure
-- ------------------------------------------------------------
create table if not exists public.executives (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null check (role in ('Pembina', 'Ketua', 'BPH', 'Anggota')),
  position     text not null default '',
  image_url    text not null default '',
  bio          text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

comment on table public.executives is 'Struktur kepengurusan IRMA Al-Ittihad';

-- ------------------------------------------------------------
-- 2. Work programs / activities
-- ------------------------------------------------------------
create table if not exists public.programs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null check (category in ('Keagamaan', 'Sosial', 'Pelatihan', 'Olahraga')),
  date        date not null,
  status      text not null default 'Akan Datang'
              check (status in ('Akan Datang', 'Berlangsung', 'Selesai')),
  location    text not null default '',
  created_at  timestamptz not null default now()
);

comment on table public.programs is 'Program kerja / rencana kegiatan IRMA';

-- ------------------------------------------------------------
-- 3. Media gallery
-- ------------------------------------------------------------
create table if not exists public.gallery (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  image_url  text not null,
  category   text not null default 'Lainnya',
  date       date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.gallery is 'Dokumentasi kegiatan (PhBI, Bakti Sosial, Study Group, Camping, ...)';

-- ------------------------------------------------------------
-- 4. Treasury / cash transparency (infaq logs)
-- ------------------------------------------------------------
create table if not exists public.financial_logs (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  amount     integer not null check (amount >= 0),
  type       text not null check (type in ('income', 'expense')),
  date       date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.financial_logs is 'Kas IRMA: pemasukan (infaq) & pengeluaran';

-- ------------------------------------------------------------
-- 5. Daily quotes (Hadith / Ayat)
-- ------------------------------------------------------------
create table if not exists public.quotes (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  source     text not null check (source in ('Hadith', 'Ayat')),
  arabic     text,
  created_at timestamptz not null default now()
);

comment on table public.quotes is 'Kutipan harian: hadist & ayat Al-Qur''an';

-- ------------------------------------------------------------
-- Row Level Security: public read-only, no anon writes.
-- ------------------------------------------------------------
alter table public.executives     enable row level security;
alter table public.programs       enable row level security;
alter table public.gallery        enable row level security;
alter table public.financial_logs enable row level security;
alter table public.quotes         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['executives', 'programs', 'gallery', 'financial_logs', 'quotes']
  loop
    execute format(
      'drop policy if exists "%s public read" on public.%I',
      t, t
    );
    execute format(
      'create policy "%s public read" on public.%I for select using (true)',
      t, t
    );
  end loop;
end $$;

-- ------------------------------------------------------------
-- Seed data (optional demo rows)
-- ------------------------------------------------------------
insert into public.quotes (text, source, arabic) values
  ('Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.', 'Hadith', null),
  ('Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri.', 'Ayat',
   'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ')
on conflict do nothing;

-- ============================================================
-- ADMIN (halaman /admin) — izin tulis & storage gambar
-- Bagian ini idempoten: aman dijalankan berulang.
-- Jalankan file `supabase/migrations/20261024_admin_access.sql`
-- untuk basis data yang sudah berjalan, atau seluruh file ini
-- untuk setup baru.
-- ============================================================

-- Hanya pengguna yang LOGIN (role `authenticated`) yang boleh mengubah data.
-- Publik tetap hanya bisa membaca (kebijakan "public read" di atas).
drop policy if exists "executives admin all" on public.executives;
create policy "executives admin all" on public.executives
  for all to authenticated
  using (true) with check (true);

drop policy if exists "gallery admin all" on public.gallery;
create policy "gallery admin all" on public.gallery
  for all to authenticated
  using (true) with check (true);

drop policy if exists "programs admin all" on public.programs;
create policy "programs admin all" on public.programs
  for all to authenticated
  using (true) with check (true);

drop policy if exists "financial_logs admin all" on public.financial_logs;
create policy "financial_logs admin all" on public.financial_logs
  for all to authenticated
  using (true) with check (true);

drop policy if exists "quotes admin all" on public.quotes;
create policy "quotes admin all" on public.quotes
  for all to authenticated
  using (true) with check (true);

-- Bucket penyimpanan gambar (galeri & foto pengurus). Publik boleh lihat,
-- hanya admin login yang boleh unggah/hapus.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media authenticated insert" on storage.objects;
create policy "media authenticated insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media authenticated update" on storage.objects;
create policy "media authenticated update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media') with check (bucket_id = 'media');

drop policy if exists "media authenticated delete" on storage.objects;
create policy "media authenticated delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media');
