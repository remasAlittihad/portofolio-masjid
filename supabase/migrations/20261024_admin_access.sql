-- ============================================================
-- Migrasi: akses admin untuk halaman /admin
-- Jalankan di Supabase SQL Editor untuk proyek yang SUDAH berjalan.
-- Idempoten — aman dijalankan berulang.
--
-- Isi:
--   1. Izin tulis (INSERT/UPDATE/DELETE) untuk role `authenticated`
--      pada tabel yang dikelola admin.
--   2. Bucket Storage `media` (publik dibaca, admin login menulis).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Izin tulis untuk admin yang sudah login
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 2. Bucket Storage untuk gambar (galeri & foto pengurus)
-- ------------------------------------------------------------
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
