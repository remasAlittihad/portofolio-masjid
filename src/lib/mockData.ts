import type {
  Executive,
  FinancialLog,
  GalleryItem,
  Program,
  Quote,
  UpcomingEvent,
} from "./types";
import { PENGURUS_EXECUTIVES } from "./pengurus";

/**
 * Mock fallback dataset — used whenever Supabase env vars are missing
 * or a table returns no rows. Keeps the portfolio fully populated.
 */

/**
 * Pengurus tampil di section Management — sumber datanya lembar dokumen
 * "Lampiran Nama-Nama Pengurus Ikatan Remaja Masjid Al Ittihad".
 * Lihat `pengurus.ts` untuk data nama + posisi mentah.
 */
export const MOCK_EXECUTIVES: Executive[] = PENGURUS_EXECUTIVES;

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "pg-1",
    title: "Kajian Pemuda Mingguan",
    description:
      "Kajian rutin setiap Minggu pagi bersama pembina untuk memperkuat keimanan dan akhlak pemuda.",
    category: "Keagamaan",
    date: "2026-10-25",
    status: "Berlangsung",
    location: "Masjid Al-Ittihad",
  },
  {
    id: "pg-2",
    title: "Tadarus & Halaqah Ramadhan",
    description:
      "Program tadarus Al-Qur'an dan halaqah selama bulan Ramadhan dengan target khatam 30 juz.",
    category: "Keagamaan",
    date: "2027-02-18",
    status: "Akan Datang",
    location: "Masjid Al-Ittihad — Serambi Utama",
  },
  {
    id: "pg-3",
    title: "Bakti Sosial Lingkungan",
    description:
      "Kerja bakti, keramas masjid, dan bersih-bersih lingkungan bersama warga sekitar masjid.",
    category: "Sosial",
    date: "2026-11-08",
    status: "Akan Datang",
    location: "Lingkungan Masjid Al-Ittihad",
  },
  {
    id: "pg-4",
    title: "Santunan Anak Yatim",
    description:
      "Pengumpulan dan penyaluran infaq untuk santunan anak yatim serta dhuafa di sekitar masjid.",
    category: "Sosial",
    date: "2026-09-20",
    status: "Selesai",
    location: "Aula Masjid Al-Ittihad",
  },
  {
    id: "pg-5",
    title: "Pelatihan Kepemimpinan Kader",
    description:
      "Workshop leadership, public speaking, dan manajemen organisasi untuk kader IRMA angkatan baru.",
    category: "Pelatihan",
    date: "2026-11-22",
    status: "Akan Datang",
    location: "Aula Serbaguna Masjid",
  },
  {
    id: "pg-6",
    title: "Kelas Digital & Desain Grafis",
    description:
      "Pelatihan desain grafis dan content creation untuk mendukung media dakwah IRMA.",
    category: "Pelatihan",
    date: "2026-10-10",
    status: "Selesai",
    location: "Ruang Multimedia",
  },
  {
    id: "pg-7",
    title: "Turnamen Futsal Antar Seksi",
    description:
      "Kompetisi futsal internal yang diikuti seluruh seksi untuk mempererat silaturahmi.",
    category: "Olahraga",
    date: "2026-11-15",
    status: "Akan Datang",
    location: "Lapangan Futsal Al-Ittihad",
  },
  {
    id: "pg-8",
    title: "Senam Sehat Jemaah",
    description:
      "Senam pagi bersama seluruh jemaah masjid sebagai bentuk gaya hidup sehat umat.",
    category: "Olahraga",
    date: "2026-10-17",
    status: "Berlangsung",
    location: "Halaman Masjid Al-Ittihad",
  },
  {
    id: "pg-9",
    title: "PhBI Peringatan Hari Besar Islam",
    description:
      "Perayaan Hari Besar Islam dengan lomba, pameran, dan kegiatan edukatif untuk keluarga besar.",
    category: "Keagamaan",
    date: "2026-12-06",
    status: "Akan Datang",
    location: "Kompleks Masjid Al-Ittihad",
  },
  {
    id: "pg-10",
    title: "Buka Puasa Bersama & Piknik Dakwah",
    description:
      "Silaturahmi kegiatan buka puasa bersama dan outbond kecil anggota IRMA.",
    category: "Sosial",
    date: "2026-08-15",
    status: "Selesai",
    location: "Taman Kota",
  },
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "gl-1",
    title: "PhBI Hari Besar Islam",
    image_url: "https://picsum.photos/seed/phbi1/900/700",
    category: "PhBI",
    date: "2026-07-26",
  },
  {
    id: "gl-2",
    title: "Bakti Sosial Warga Sekitar",
    image_url: "https://picsum.photos/seed/baksos2/900/700",
    category: "Bakti Sosial",
    date: "2026-08-02",
  },
  {
    id: "gl-3",
    title: "Kelompok Kajian Pemuda",
    image_url: "https://picsum.photos/seed/kajian3/900/700",
    category: "Study Group",
    date: "2026-08-09",
  },
  {
    id: "gl-4",
    title: "Camping Dakwah Pemuda",
    image_url: "https://picsum.photos/seed/camping4/900/700",
    category: "Camping",
    date: "2026-08-23",
  },
  {
    id: "gl-5",
    title: "Santunan Anak Yatim",
    image_url: "https://picsum.photos/seed/santunan5/900/700",
    category: "Bakti Sosial",
    date: "2026-09-20",
  },
  {
    id: "gl-6",
    title: "Tadarus Bulan Suci",
    image_url: "https://picsum.photos/seed/tadarus6/900/700",
    category: "PhBI",
    date: "2026-06-12",
  },
  {
    id: "gl-7",
    title: "Diskusi Kader Muda",
    image_url: "https://picsum.photos/seed/kader7/900/700",
    category: "Study Group",
    date: "2026-09-05",
  },
  {
    id: "gl-8",
    title: "Outbond Keakraban Anggota",
    image_url: "https://picsum.photos/seed/outbond8/900/700",
    category: "Camping",
    date: "2026-07-05",
  },
  {
    id: "gl-9",
    title: "Lomba PhBI Anak Shalih",
    image_url: "https://picsum.photos/seed/lomba9/900/700",
    category: "PhBI",
    date: "2026-05-24",
  },
  {
    id: "gl-10",
    title: "Aksi Kebersihan Sungai",
    image_url: "https://picsum.photos/seed/sungai10/900/700",
    category: "Bakti Sosial",
    date: "2026-04-18",
  },
  {
    id: "gl-11",
    title: "Kajian Akhir Pekan",
    image_url: "https://picsum.photos/seed/kajian11/900/700",
    category: "Study Group",
    date: "2026-03-14",
  },
  {
    id: "gl-12",
    title: "Api Unggun Pemuda",
    image_url: "https://picsum.photos/seed/unggun12/900/700",
    category: "Camping",
    date: "2026-02-28",
  },
];

export const MOCK_FINANCIAL_LOGS: FinancialLog[] = [
  { id: "fl-1", title: "Infaq Jumat Khatib", amount: 1_750_000, type: "income", date: "2026-10-02" },
  { id: "fl-2", title: "Konsumsi Kajian Pemuda", amount: 350_000, type: "expense", date: "2026-10-04" },
  { id: "fl-3", title: "Infaq Sukarela Anggota", amount: 900_000, type: "income", date: "2026-10-06" },
  { id: "fl-4", title: "Perlengkapan Sound System", amount: 450_000, type: "expense", date: "2026-10-09" },
  { id: "fl-5", title: "Donasi PhBI", amount: 3_200_000, type: "income", date: "2026-10-11" },
  { id: "fl-6", title: "Cetak Spanduk Kegiatan", amount: 275_000, type: "expense", date: "2026-10-13" },
  { id: "fl-7", title: "Infaq Santunan Yatim", amount: 2_500_000, type: "income", date: "2026-10-15" },
  { id: "fl-8", title: "Transport Santunan", amount: 200_000, type: "expense", date: "2026-10-16" },
  { id: "fl-9", title: "Hasil Bazar Pemuda", amount: 1_450_000, type: "income", date: "2026-10-18" },
  { id: "fl-10", title: "Snack Senam Sehat", amount: 320_000, type: "expense", date: "2026-10-19" },
  { id: "fl-11", title: "Infaq Khatam Qur'an", amount: 1_100_000, type: "income", date: "2026-10-21" },
  { id: "fl-12", title: "Kebersihan & Keperluan Masjid", amount: 410_000, type: "expense", date: "2026-10-22" },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: "q-1",
    source: "Ayat",
    text: "“Sesungguhnya Allah tidak akan mengubah keadaan suatu kaum sebelum mereka mengubah keadaan diri mereka sendiri.”",
    arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
  },
  {
    id: "q-2",
    source: "Ayat",
    text: "“Dan hendaklah ada dari kamu umat yang menyeru kepada kebajikan, menyuruh kepada yang ma'ruf dan mencegah dari yang munkar.”",
    arabic: "وَلْتَكُن مِّنكُمْ أُمَّةٌ يَدْعُونَ إِلَى الْخَيْرِ وَيَأْمُرُونَ بِالْمَعْرُوفِ وَيَنْهَوْنَ عَنِ الْمُنكَرِ",
  },
  {
    id: "q-3",
    source: "Hadith",
    text: "“Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.” (HR. Thabrani)",
  },
  {
    id: "q-4",
    source: "Hadith",
    text: "“Barangsiapa menempuh satu jalan untuk menuntut ilmu, maka Allah akan mudahkan baginya jalan menuju surga.” (HR. Muslim)",
  },
  {
    id: "q-5",
    source: "Ayat",
    text: "“Hai orang-orang yang beriman, bersabarlah kamu dan kuatkanlah kesabaranmu dan tetaplah bersiap siaga...”",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ",
  },
  {
    id: "q-6",
    source: "Hadith",
    text: "“Perumpamaan orang-orang mukmin dalam saling mencintai, kekasih, dan saling berinteraksi adalah seperti satu tubuh.” (HR. Bukhari-Muslim)",
  },
  {
    id: "q-7",
    source: "Ayat",
    text: "“Sesungguhnya shalat itu mencegah dari perbuatan keji dan mungkar.”",
    arabic: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ",
  },
  {
    id: "q-8",
    source: "Hadith",
    text: "“Beruntunglah orang yang dilatih di masa mudanya.” (HR. Ibnu Majah)",
  },
];

/**
 * Upcoming events — the first one in the future is used for the countdown.
 * (Kept client-side; not part of the core 5-table schema.)
 */
export const MOCK_EVENTS: UpcomingEvent[] = [
  {
    id: "ev-1",
    title: "Tabligh Akbar Pemuda",
    date: "2026-11-29T09:00:00+07:00",
    description:
      "Tabligh akbar bersama ulama ternama dengan tema pemuda pembangun peradaban.",
  },
  {
    id: "ev-2",
    title: "Persiapan Ramadhan IRMA",
    date: "2027-02-10T19:30:00+07:00",
    description:
      "Rapat koordinasi dan gladi bersih seluruh panitia kegiatan Ramadhan.",
  },
  {
    id: "ev-3",
    title: "Syawalan & Halal Bihalal",
    date: "2027-04-05T08:00:00+07:00",
    description:
      "Silaturahmi halal bihalal seluruh jemaah dan anggota IRMA Al-Ittihad.",
  },
];
