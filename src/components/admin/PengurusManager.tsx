"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PersonPhoto } from "@/components/ui/PersonPhoto";
import {
  deleteExecutiveAction,
  saveExecutiveAction,
  seedExecutivesAction,
  type AdminResult,
} from "@/app/admin/actions";
import type { Executive, ExecutiveRole } from "@/lib/types";

const ROLES: ExecutiveRole[] = ["Pembina", "Ketua", "BPH", "Anggota"];

interface Props {
  items: Executive[];
  error: string | null;
}

interface FormState {
  id: string | null;
  name: string;
  position: string;
  role: ExecutiveRole;
  bio: string;
  image_url: string;
}

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  position: "",
  role: "Anggota",
  bio: "",
  image_url: "",
};

export function PengurusManager({ items, error }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [open, setOpen] = useState(false);
  const [busy, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (p: Executive) => {
    setForm({
      id: p.id,
      name: p.name,
      position: p.position,
      role: p.role,
      bio: p.bio ?? "",
      image_url: p.image_url ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (form.id) fd.set("id", form.id);
    fd.set("existing_url", form.image_url);

    startTransition(async () => {
      const res: AdminResult = await saveExecutiveAction(fd);
      if (res.ok) {
        setOpen(false);
        setFlash({ type: "ok", text: "Data pengurus tersimpan." });
        router.refresh();
      } else {
        setFlash({ type: "err", text: res.message ?? "Gagal menyimpan." });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Hapus pengurus ini?")) return;
    startTransition(async () => {
      const res = await deleteExecutiveAction(id);
      if (res.ok) {
        setFlash({ type: "ok", text: "Pengurus dihapus." });
        router.refresh();
      } else {
        setFlash({ type: "err", text: res.message ?? "Gagal menghapus." });
      }
    });
  };

  const handleSeed = () => {
    if (
      !confirm(
        "Impor daftar nama pengurus awal dari kode ke Supabase? Ini hanya untuk mengisi data pertama kali.",
      )
    )
      return;
    startTransition(async () => {
      const res = await seedExecutivesAction();
      setFlash({
        type: res.ok ? "ok" : "err",
        text: res.message ?? (res.ok ? "Berhasil diimpor." : "Gagal mengimpor."),
      });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {items.length} pengurus
        </p>
        <div className="flex flex-wrap gap-2">
          {items.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-400"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Impor Nama Awal
            </button>
          )}
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Pengurus
          </button>
        </div>
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
          Data pengurus belum bisa dimuat dari Supabase: {error}. Pastikan
          migrasi dijalankan.
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 py-14 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Belum ada pengurus. Impor nama awal atau tambah manual.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-zinc-50 text-start dark:bg-zinc-900">
              <tr className="text-start text-xs font-bold uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3 text-start">Nama</th>
                <th className="px-4 py-3 text-start">Jabatan</th>
                <th className="px-4 py-3 text-start">Role</th>
                <th className="px-4 py-3 text-end">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white transition hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <PersonPhoto
                        src={p.image_url}
                        alt={p.name}
                        boxClassName="h-10 w-10 rounded-lg"
                        imageClassName="object-cover"
                        width={40}
                        height={40}
                      />
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    {p.position}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      {p.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        aria-label="Edit"
                        className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        aria-label="Hapus"
                        className="rounded-lg border border-zinc-200 p-2 text-zinc-500 transition hover:border-rose-500 hover:text-rose-600 dark:border-zinc-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal form tambah/edit */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={form.id ? "Edit Pengurus" : "Tambah Pengurus"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="p-6 sm:p-7">
          <h3 className="text-lg font-extrabold">
            {form.id ? "Edit Pengurus" : "Tambah Pengurus"}
          </h3>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="p-name"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                Nama
              </label>
              <input
                id="p-name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="p-position"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Jabatan
                </label>
                <input
                  id="p-position"
                  name="position"
                  required
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="Ketua, Sekretaris, Koord Sosial…"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label
                  htmlFor="p-role"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                >
                  Role
                </label>
                <select
                  id="p-role"
                  name="role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as ExecutiveRole })
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="p-bio"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                Bio (opsional)
              </label>
              <textarea
                id="p-bio"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>

            <div>
              <label
                htmlFor="p-image"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
              >
                Foto {form.id && "(kosongkan bila tidak diganti)"}
              </label>
              <input
                id="p-image"
                name="image"
                type="file"
                accept="image/*"
                className="w-full text-sm text-zinc-600 file:me-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300 dark:file:bg-emerald-500/15 dark:file:text-emerald-400"
              />
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {form.image_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image_url}
                        alt="Pratinjau"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image_url: "" })}
                        aria-label="Hapus foto"
                        className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-rose-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-zinc-800">
                      <UserRound className="h-8 w-8" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  Belum ada foto akan tampil ikon orang di situs.
                </p>
              </div>
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
