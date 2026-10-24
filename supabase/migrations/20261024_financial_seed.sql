-- Data awal kas IRMA Al-Ittihad
-- Jalankan setelah schema.sql pada Supabase SQL Editor.

insert into public.financial_logs (title, amount, type, date) values
  ('Saldo awal kas organisasi', 2500000, 'income', '2026-01-01'),
  ('Infaq jamaah bulan Januari', 1250000, 'income', '2026-01-05'),
  ('Pembelian alat kebersihan masjid', 350000, 'expense', '2026-01-08'),
  ('Donasi kegiatan kajian', 750000, 'income', '2026-01-12'),
  ('Konsumsi kajian rutin', 275000, 'expense', '2026-01-12'),
  ('Bantuan sosial warga sekitar', 500000, 'expense', '2026-01-18'),
  ('Infaq jamaah bulan Februari', 1100000, 'income', '2026-02-05')
;
