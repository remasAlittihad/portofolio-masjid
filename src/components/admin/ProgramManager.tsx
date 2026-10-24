"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteProgramAction, saveProgramAction } from "@/app/admin/actions";
import type { Program, ProgramCategory, ProgramStatus } from "@/lib/types";

const categories: ProgramCategory[] = ["Keagamaan", "Sosial", "Pelatihan", "Olahraga"];
const statuses: ProgramStatus[] = ["Akan Datang", "Berlangsung", "Selesai"];

type FormState = {
  id: string;
  title: string;
  description: string;
  category: ProgramCategory;
  date: string;
  status: ProgramStatus;
  location: string;
};

const empty: FormState = {
  id: "",
  title: "",
  description: "",
  category: "Keagamaan",
  date: "",
  status: "Akan Datang",
  location: "",
};

function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-400 bg-zinc-900 px-3 py-3 text-left text-sm text-zinc-100 outline-none transition hover:border-emerald-400 focus:border-emerald-500"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-zinc-600 bg-zinc-900 p-1 shadow-2xl"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                option === value
                  ? "bg-emerald-600 text-white"
                  : "text-zinc-100 hover:bg-zinc-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProgramManager({
  items,
  error,
}: {
  items: Program[];
  error: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [open, setOpen] = useState(false);
  const [busy, start] = useTransition();
  const [message, setMessage] = useState("");

  const edit = (program: Program) => {
    setForm({
      id: program.id,
      title: program.title,
      description: program.description ?? "",
      category: program.category,
      date: program.date,
      status: program.status,
      location: program.location ?? "",
    });
    setOpen(true);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (form.id) formData.set("id", form.id);

    start(async () => {
      const result = await saveProgramAction(formData);
      setMessage(result.ok ? "Program tersimpan." : result.message ?? "Gagal menyimpan.");
      if (result.ok) {
        setOpen(false);
        router.refresh();
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("Hapus program ini?")) return;
    start(async () => {
      const result = await deleteProgramAction(id);
      setMessage(result.ok ? "Program dihapus." : result.message ?? "Gagal menghapus.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-500">{items.length} program kerja</p>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(empty);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Tambah Program
        </button>
      </div>

      <div className="grid gap-3">
        {items.map((program) => (
          <div
            key={program.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div>
              <h3 className="font-bold">{program.title}</h3>
              <p className="text-sm text-zinc-500">
                {program.category} · {program.date} · {program.status}
              </p>
              <p className="text-sm text-zinc-500">{program.location}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => edit(program)} className="rounded-lg border p-2">
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => remove(program.id)}
                className="rounded-lg border p-2 text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-lg space-y-3 rounded-2xl bg-zinc-900 p-6 text-zinc-100 shadow-2xl"
          >
            <h2 className="text-xl font-bold">
              {form.id ? "Edit" : "Tambah"} Program Kerja
            </h2>
            <input
              name="title"
              required
              placeholder="Judul program"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-lg border border-zinc-400 bg-zinc-900 p-3 text-zinc-100 placeholder:text-zinc-400"
            />
            <textarea
              name="description"
              placeholder="Deskripsi"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-lg border border-zinc-400 bg-zinc-900 p-3 text-zinc-100 placeholder:text-zinc-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Dropdown
                  value={form.category}
                  options={categories}
                  onChange={(category) => setForm({ ...form, category })}
                />
                <input type="hidden" name="category" value={form.category} />
              </div>
              <div>
                <Dropdown
                  value={form.status}
                  options={statuses}
                  onChange={(status) => setForm({ ...form, status })}
                />
                <input type="hidden" name="status" value={form.status} />
              </div>
            </div>
            <input
              name="date"
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
              className="w-full rounded-lg border border-zinc-400 bg-zinc-900 p-3 text-zinc-100"
            />
            <input
              name="location"
              placeholder="Lokasi"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              className="w-full rounded-lg border border-zinc-400 bg-zinc-900 p-3 text-zinc-100 placeholder:text-zinc-400"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-zinc-500 px-4 py-2"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
