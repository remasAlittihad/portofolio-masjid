# Foto Pengurus

Taruh foto pengurus di folder ini (format .jpg / .png / .webp), lalu
isi slot `foto` di `src/lib/pengurus.ts`, contoh:

    { nama: "Ust Foni Agus Setiawan", posisi: "Pengarah", foto: "/pengurus/foni.jpg" },

Aturan path:

- Selalu diawali "/" dan mengacu ke isi folder `public/` (folder ini).
- Nama file tanpa spasi lebih aman, mis. `foni.jpg` (spasi harus ditulis
  persis seperti aslinya di URL).
- Slot `foto: ""` = belum ada fotonya → di halaman tampil ikon orang
  sebagai pengganti, jadi aman dibiarkan kosong dulu.
