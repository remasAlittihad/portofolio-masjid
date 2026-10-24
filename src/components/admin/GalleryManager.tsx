"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  deleteGalleryItemAction,
  saveGalleryItemAction,
  type AdminResult,
} from "@/app/admin/actions";
import { galleryFallback, imageSrc } from "@/lib/image";
import type { GalleryItem } from "@/lib/types";

const SUGGESTED_CATEGORIES = [
  "PhBI",
  "Bakti Sosial",
  "Study Group",
  "Camping",
  "Lainnya",
];

interface Props {
  items: GalleryItem[];
  error: string | null;
}

interface FormState {
  id: string | null;
  title: string;
  category: string;
  date: string;
  image_url: string;
}

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  category: "Lainnya",
  date: "2024-01-01",
  image_url: "",
};

export function GalleryManager({ items, error }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [open, setOpen] = useState(false);
  const [busy, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      date: item.date,
      image_url: item.image_url,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (form.id) fd.set("id", form.id);
    fd.set("existing_url", form.image_url);

    startTransition(async () => {
      const res: AdminResult = await saveGalleryItemAction(fd);
      if (res.ok) {
        setOpen(false);
        setFlash({ type: "ok", text: "Item galeri tersimpan." });
        router.refresh();
      } else {
        setFlash({ type: "err", text: res.message ?? "Gagal menyimpan." });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus item galeri ini?")) return;
    startTransition(async () => {
      const res = await deleteGalleryItemAction(id);
      if (res.ok) {
        setFlash({ type: "ok", text: "Item dihapus." });
        router.refresh();
      } else {
        setFlash({ type: "err", text: res.message ?? "Gagal menghapus." });
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {items.length} item galeri
        </p>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Galeri
        </button>
      </div>

      {flash && (
        <p
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
            flash.type === "ok"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {flash.text}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          Galeri belum bisa dimuat dari Supabase: {error}. Pastikan migrasi
          dijalankan.
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 py-14 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Belum ada item galeri. Klik &quot;Tambah Galeri&quot; untuk memulai.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-4/3">
                <Image
                  src={imageSrc(item.image_url, galleryFallback(item.id))}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2 p-4">
                <div className="min-w-0">
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {item.category}
                  </span>
                  <h3 className="mt-1.5 truncate text-sm font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label="Edit"
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label="Hapus"
                    className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition hover:border-rose-500 hover:text-rose-600 dark:border-zinc-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form tambah/edit */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={form.id ? "Edit Galeri" : "Tambah Galeri"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="p-6 sm:p-7">
          <h3 className="text-lg font-extrabold">
            {form.id ? "Edit Item Galeri" : "Tambah Item Galeri"}
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="g-title"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                Judul
              </label>
              <input
                id="g-title"
                name="title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="g-category"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Kategori
                </label>
                <input
                  id="g-category"
                  name="category"
                  list="g-category-list"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
                />
                <datalist id="g-category-list">
                  {SUGGESTED_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label
                  htmlFor="g-date"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Tanggal
                </label>
                <input
                  id="g-date"
                  name="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="g-image"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                Gambar {form.id && "(kosongkan bila tidak diganti)"}
              </label>
              <input
                id="g-image"
                name="image"
                type="file"
                accept="image/*"
                className="w-full text-sm text-zinc-600 file:me-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300 dark:file:bg-emerald-500/15 dark:file:text-emerald-400"
              />
              {form.image_url && (
                <div className="relative mt-3 h-32 w-32 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <Image
                    src={imageSrc(form.image_url, galleryFallback(form.id ?? "new"))}
                    alt="Pratinjau"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: "" })}
                    aria-label="Hapus gambar"
                    className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-rose-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
