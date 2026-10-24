/**
 * Lampiran Nama-Nama Pengurus Ikatan Remaja Masjid Al Ittihad.
 * Diketik ulang dari dokumen resmi Dewan Kemakmuran Masjid Al-Ittihad.
 */

import type { Executive, ExecutiveRole } from "./types";

export interface PengurusAnggota {
  nama: string;
  posisi: string;
  /**
   * Slot foto — isi path dari folder `public/`, mis. "/pengurus/foni.jpg".
   * Kosongkan ("") selama fotonya belum ada: kartu akan menampilkan
   * ikon orang sebagai pengganti, bukan foto placeholder acak.
   */
  foto: string;
}

/** Daftar Pengarah & Pembina */
export const PEMBINA: PengurusAnggota[] = [
  { nama: "Ust Foni Agus Setiawan", posisi: "Pengarah", foto: "" },
  { nama: "Ust Ismail", posisi: "Pembina", foto: "" },
  { nama: "Zakki Sarkiwan Aditya", posisi: "Pembina", foto: "" },
  { nama: "Ust Muhammad Nur Yasin", posisi: "Pembina", foto: "" },
  { nama: "Rommy Habibie", posisi: "Pembina", foto: "" },
];

/** Susunan Pengurus (BPH) */
export const SUSUNAN_PENGURUS: PengurusAnggota[] = [
  { nama: "Hafidz Alfarizi", posisi: "Ketua", foto: "/pengurus/hafidz.jpeg" },
  { nama: "Andjani Citra Prameswari", posisi: "Sekretaris", foto: "" },
  { nama: "Bintang Arca Dea", posisi: "Bendahara", foto: "" },
];

/** Seksie — baris berposisi "Koord ..." adalah ketua seksi, sisanya anggota */
export const SEKSIE: PengurusAnggota[] = [
  { nama: "Muhammad Ikhsan Nordin", posisi: "Koord Agama dan Pendidikan", foto: "" },
  { nama: "Muhammad Zufar Khalish", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Hazmi Anwar", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Rifqi Alngzizi", posisi: "Anggota", foto: "" },
  { nama: "Seruni Sekar Arum", posisi: "Koord Sosial", foto: "" },
  { nama: "Khalisa Syifa Ramadhani", posisi: "Anggota", foto: "" },
  { nama: "Khaifa Moris Alya Muhdita", posisi: "Anggota", foto: "" },
  { nama: "Adelia Husanah", posisi: "Anggota", foto: "" },
  { nama: "Putri Syafira", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Fajri Tauhidillah", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Oktsa Arthur Fadlilah", posisi: "Anggota", foto: "" },
  { nama: "Zaky Fadilah", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Fahier", posisi: "Koord Olahraga", foto: "" },
  { nama: "Chilla Azzora Adinda Putri", posisi: "Anggota", foto: "" },
  { nama: "Nabil Putradelia Destansha", posisi: "Anggota", foto: "" },
  { nama: "Medwyn John Budiman", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Fahier", posisi: "Anggota", foto: "" },
  { nama: "Ilyas Aqil Dzakwan", posisi: "Anggota", foto: "" },
  { nama: "Muhammad Azzam Ramadhan", posisi: "Anggota", foto: "" },
  { nama: "Chilla Azzora Adinda Putri", posisi: "Koord Humas dan Komunikasi Remaja", foto: "" },
  { nama: "Ichwan Hussain Nurril", posisi: "Anggota", foto: "" },
  { nama: "Fathur Rizqi", posisi: "Anggota", foto: "" },
  { nama: "Novia Akifa Naila", posisi: "Anggota", foto: "" },
  { nama: "Rasya Algiffari Maulana", posisi: "Anggota", foto: "" },
  { nama: "Bilal Cakra Assidiq", posisi: "Anggota", foto: "" },
  { nama: "Qayla Oktavia", posisi: "Anggota", foto: "" },
  { nama: "Gendis Aprilia Putri", posisi: "Anggota", foto: "" },
];

/** Gabungan seluruh pengurus sesuai urutan dokumen */
export const SEMUA_PENGURUS: PengurusAnggota[] = [
  ...PEMBINA,
  ...SUSUNAN_PENGURUS,
  ...SEKSIE,
];

/* ------------------------------------------------------------------ */
/* Konversi ke tipe Executive agar tampil di section Management         */
/* ------------------------------------------------------------------ */

/** Posisi di lembar dokumen → role filter yang dipakai UI Management */
function toRole(posisi: string): ExecutiveRole {
  const p = posisi ?? ""; // data aman saat daftar sedang diedit
  if (p.startsWith("Koord")) return "BPH";
  switch (p) {
    case "Pengarah":
    case "Pembina":
      return "Pembina";
    case "Ketua":
      return "Ketua";
    case "Sekretaris":
    case "Bendahara":
      return "BPH";
    default:
      return "Anggota";
  }
}

const BIO_BY_ROLE: Record<ExecutiveRole, string> = {
  Pembina:
    "Pembina organisasi yang membimbing arah dakwah dan kedisiplinan kader IRMA Al-Ittihad.",
  Ketua:
    "Memimpin perencanaan dan eksekusi seluruh program kerja IRMA dengan penuh tanggung jawab.",
  BPH: "Mengurus bidang dan koordinasi operasional kegiatan IRMA Al-Ittihad.",
  Anggota: "Anggota aktif Ikatan Remaja Masjid Al-Ittihad yang mendukung seluruh program kerja.",
};

/**
 * Mengubah daftar nama+posisi dari lembar dokumen menjadi data `Executive`
 * yang digunakan section Management (`Organization.tsx`).
 */
export const PENGURUS_EXECUTIVES: Executive[] = SEMUA_PENGURUS.map(
  (orang, i) => {
    const { nama, posisi, foto } = orang;
    const role = toRole(posisi);
    return {
      id: `ex-${i + 1}`,
      name: nama,
      role,
      position: posisi,
      // "" = belum ada foto → UI menampilkan ikon orang (lihat Organization.tsx)
      image_url: foto.trim(),
      bio: BIO_BY_ROLE[role],
      social_links: {},
    };
  },
);
