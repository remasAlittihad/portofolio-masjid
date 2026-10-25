"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { deleteFinancialAction, saveFinancialAction } from "@/app/admin/actions";
import type { FinancialLog, FinancialType } from "@/lib/types";

const empty = { id: "", title: "", amount: "", type: "income" as FinancialType, date: new Date().toISOString().slice(0, 10) };
export function KasManager({ items }: { items: FinancialLog[] }) {
  const router = useRouter(); const [form, setForm] = useState(empty); const [open, setOpen] = useState(false); const [busy, start] = useTransition();
  const edit = (item: FinancialLog) => { setForm({ id: item.id, title: item.title, amount: String(item.amount), type: item.type, date: item.date }); setOpen(true); };
  const save = (e: React.FormEvent) => { e.preventDefault(); start(async () => { const result = await saveFinancialAction(new FormData(e.currentTarget as HTMLFormElement)); if (!result.ok) { alert(result.message); return; } setOpen(false); setForm(empty); router.refresh(); }); };
  const remove = (id: string) => { if (!confirm("Hapus transaksi ini?")) return; start(async () => { await deleteFinancialAction(id); router.refresh(); }); };
  return <div className="flex flex-col gap-4">
    <button onClick={() => { setForm(empty); setOpen(true); }} className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Tambah Transaksi</button>
    {open && <form onSubmit={save} className="grid gap-3 rounded-2xl border border-emerald-200 bg-white p-5 sm:grid-cols-2 dark:border-emerald-500/30 dark:bg-zinc-900">
      <input type="hidden" name="id" value={form.id} />
      <input required name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Keterangan" className="rounded-xl border p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      <input required name="amount" type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Nominal" className="rounded-xl border p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      <select name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as FinancialType })} className="rounded-xl border p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select>
      <input required name="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-xl border p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
      <div className="flex gap-2 sm:col-span-2"><button disabled={busy} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}</button><button type="button" onClick={() => setOpen(false)} className="rounded-full border px-5 py-2 text-sm font-bold">Batal</button></div>
    </form>}
    <div className="min-w-0 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800"><table className="w-full min-w-[520px] text-left text-sm"><tbody>{items.map(item => <tr key={item.id} className="border-b last:border-0 dark:border-zinc-800"><td className="px-4 py-3 font-semibold">{item.title}<div className="text-xs text-zinc-500">{item.date}</div></td><td className={`px-4 py-3 font-bold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>{item.type === "income" ? "+" : "-"}Rp {item.amount.toLocaleString("id-ID")}</td><td className="px-4 py-3 text-right"><button onClick={() => edit(item)} className="mr-2 text-emerald-600"><Pencil className="inline h-4 w-4" /></button><button onClick={() => remove(item.id)} className="text-rose-600"><Trash2 className="inline h-4 w-4" /></button></td></tr>)}</tbody></table></div>
  </div>;
}
