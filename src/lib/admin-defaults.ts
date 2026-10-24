import type { Executive, GalleryItem, Program } from "./types";

/** Data contoh yang dipakai dashboard admin saat tabel Supabase masih kosong. */
export const defaultPrograms: Program[] = [
  {
    id: "default-program-1",
    title: "Kajian Rutin Ahad",
    description: "Kajian Islam dan diskusi bersama jamaah setiap hari Ahad.",
    category: "Keagamaan",
    date: "2026-01-11",
    status: "Akan Datang",
    location: "Masjid Al-Ittihad",
  },
  {
    id: "default-program-2",
    title: "Bakti Sosial Ramadhan",
    description: "Berbagi paket sembako untuk warga sekitar masjid.",
    category: "Sosial",
    date: "2026-03-15",
    status: "Akan Datang",
    location: "Halaman Masjid Al-Ittihad",
  },
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "default-gallery-1",
    title: "Kegiatan Kajian Jamaah",
    image_url: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1200&q=80",
    category: "Study Group",
    date: "2026-01-01",
  },
  {
    id: "default-gallery-2",
    title: "Kebersamaan Warga",
    image_url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    category: "Bakti Sosial",
    date: "2025-12-20",
  },
];

export const defaultExecutives: Executive[] = [
  {
    id: "default-executive-1",
    name: "Ahmad Fauzi",
    role: "Ketua",
    position: "Ketua Umum",
    image_url: "",
    bio: "Mengkoordinasikan kegiatan dan pelayanan jamaah masjid.",
    social_links: {},
  },
  {
    id: "default-executive-2",
    name: "Muhammad Rizky",
    role: "BPH",
    position: "Sekretaris",
    image_url: "",
    bio: "Mengelola administrasi dan dokumentasi organisasi.",
    social_links: {},
  },
];
