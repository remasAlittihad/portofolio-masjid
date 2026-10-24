"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Copy, Loader2, Trash2, Upload } from "lucide-react";
import {
  deleteMediaAction,
  uploadMediaAction,
  type MediaEntry,
} from "@/app/admin/actions";

const FOLDERS = [
  { value: "galeri", label: "Galeri" },
  { value: "pengurus", label: "Foto Pengurus" },
];

interface Props {
  items: MediaEntry[];
}

export function MediaManager({ items }: Props) {
  const router = useRouter();
  const [folder, setFolder] = useState("galeri");
  const [busy, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("folder", folder);
    const input = fileRef.current;
    const file = input?.files?.[0];
    if (!file) {
      setFlash({ type: "err", text: "Pilih gambar dulu." });
      return;
    }
    fd.set("image", file);

    startTransition(async () => {
      const res = await uploadMediaAction(fd);
      setFlash({
        type: res.ok ? "ok" : "err",
        text: res.message ?? (res.ok ? "Terunggah." : "Gagal mengunggah."),
      });
      if (res.ok && input) input.value = "";
      router.refresh();
    });
  };

  const handleDelete = (entry: MediaEntry) => {
    if (!confirm(`Hapus gambar ${entry.name}?`)) return;
    startTransition(async () => {
      const res = await deleteMediaAction(entry.folder, entry.name);
      setFlash({
        type: res.ok ? "ok" : "err",
        text: res.ok ? "Gambar dihapus." : (res.message ?? "Gagal menghapus."),
      });
      router.refresh();
    });
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch {
      setFlash({ type: "err", text: "Gagal menyalin URL." });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Form upload */}
      <form
        onSubmit={handleUpload}
        className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Unggah Gambar
        </h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="m-folder"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Simpan ke folder
            </label>
            <select
              id="m-folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {FOLDERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="m-image"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Gambar (maks 5MB)
            </label>
            <input
              id="m-image"
              ref={fileRef}
              type="file"
              accept="image/*"
              className="w-full text-sm text-zinc-600 file:me-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300 dark:file:bg-emerald-500/15 dark:file:text-emerald-400"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Unggah
          </button>
        </div>
      </form>

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

      {/* Daftar media */}
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 py-14 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Belum ada gambar tersimpan di Supabase Storage.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((entry) => (
            <div
              key={`${entry.folder}/${entry.name}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-square">
                <Image
                  src={entry.url}
                  alt={entry.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute start-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  {entry.folder}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="truncate text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                  {entry.name}
                </p>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(entry.url)}
                    aria-label="Salin URL"
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700"
                  >
                    {copiedUrl === entry.url ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry)}
                    aria-label="Hapus"
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition hover:border-rose-500 hover:text-rose-600 dark:border-zinc-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
