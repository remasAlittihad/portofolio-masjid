"use client";

import { BarChart3, Images, UserRound, CalendarDays } from "lucide-react";
import type { Executive, GalleryItem, Program } from "@/lib/types";

interface Props {
  programs: Program[];
  gallery: GalleryItem[];
  executives: Executive[];
}

function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.label}</span>
            <span className="font-extrabold text-emerald-600">{item.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: typeof BarChart3; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold">
        <Icon className="h-5 w-5 text-emerald-600" /> {title}
      </h2>
      {children}
    </section>
  );
}

export function DataChart({ programs, gallery, executives }: Props) {
  const programCategories = ["Keagamaan", "Sosial", "Pelatihan", "Olahraga"].map((label) => ({
    label,
    value: programs.filter((item) => item.category === label).length,
  }));
  const programStatuses = ["Akan Datang", "Berlangsung", "Selesai"].map((label) => ({
    label,
    value: programs.filter((item) => item.status === label).length,
  }));
  const galleryCategories = [...new Set(gallery.map((item) => item.category))].map((label) => ({
    label,
    value: gallery.filter((item) => item.category === label).length,
  }));
  const executiveRoles = ["Pembina", "Ketua", "BPH", "Anggota"].map((label) => ({
    label,
    value: executives.filter((item) => item.role === label).length,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Program Kerja", value: programs.length, Icon: CalendarDays },
          { label: "Galeri", value: gallery.length, Icon: Images },
          { label: "Pengurus", value: executives.length, Icon: UserRound },
          { label: "Total Data", value: programs.length + gallery.length + executives.length, Icon: BarChart3 },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <Icon className="mb-2 h-5 w-5 text-emerald-600" />
            <p className="text-2xl font-black">{value}</p>
            <p className="text-xs font-semibold text-zinc-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Program berdasarkan kategori" icon={BarChart3}><BarList items={programCategories} /></Card>
        <Card title="Status program kerja" icon={CalendarDays}><BarList items={programStatuses} /></Card>
        <Card title="Galeri berdasarkan kategori" icon={Images}>
          {galleryCategories.length ? <BarList items={galleryCategories} /> : <p className="text-sm text-zinc-500">Belum ada data galeri.</p>}
        </Card>
        <Card title="Komposisi pengurus" icon={UserRound}><BarList items={executiveRoles} /></Card>
      </div>
    </div>
  );
}
