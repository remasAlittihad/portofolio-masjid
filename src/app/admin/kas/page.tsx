import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { KasManager } from "@/components/admin/KasManager";
import type { FinancialLog } from "@/lib/types";

export default function AdminKasPage() {
  return <Suspense fallback={<KasLoading />}><AdminKasLoader /></Suspense>;
}

async function AdminKasLoader() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data, error } = await supabase
    .from("financial_logs")
    .select("*")
    .order("date", { ascending: false });
  const logs = (data ?? []) as FinancialLog[];
  const income = logs.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = logs.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const format = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"><ArrowLeft className="h-4 w-4" />Kembali ke Dashboard Admin</Link>
      <div className="min-w-0"><h1 className="text-2xl font-extrabold">Kas Masjid</h1><p className="mt-1 text-sm text-zinc-500">Laporan pemasukan dan pengeluaran kas IRMA Al-Ittihad.</p></div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        <Summary icon={Wallet} label="Saldo Kas" value={format(income - expense)} color="emerald" />
        <Summary icon={TrendingUp} label="Total Pemasukan" value={format(income)} color="blue" />
        <Summary icon={TrendingDown} label="Total Pengeluaran" value={format(expense)} color="rose" />
      </div>
      <section className="overflow-visible rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-5 dark:border-zinc-800"><h2 className="font-extrabold">Riwayat Transaksi</h2></div>
        {error ? <p className="p-5 text-sm text-rose-600">Gagal mengambil data kas: {error.message}</p> : <div className="p-5"><KasManager items={logs} /></div>}
      </section>
    </div>
  );
}

function KasLoading() {
  return <div className="flex flex-col gap-6"><div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />)}</div><div className="h-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" /></div>;
}

function Summary({ icon: Icon, label, value, color }: { icon: typeof Wallet; label: string; value: string; color: "emerald" | "blue" | "rose" }) {
  const styles = { emerald: "text-emerald-600 bg-emerald-50", blue: "text-blue-600 bg-blue-50", rose: "text-rose-600 bg-rose-50" };
  return <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${styles[color]}`}><Icon className="h-5 w-5" /></div><p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</p><p className="mt-1 break-all text-lg font-black leading-tight sm:text-xl">{value}</p></div>;
}
