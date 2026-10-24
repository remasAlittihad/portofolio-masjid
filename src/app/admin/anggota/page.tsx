import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Member } from "@/lib/types";

export default function AnggotaPage() {
  return <Suspense fallback={<AnggotaLoading />}><AnggotaLoader /></Suspense>;
}

async function AnggotaLoader() {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
  const members = (data ?? []) as Member[];
  if (error?.code === "PGRST205") {
    return <div className="flex flex-col gap-6"><Link href="/admin" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-600"><ArrowLeft className="h-4 w-4" />Kembali ke Dashboard Admin</Link><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800"><p className="font-bold">Tabel anggota belum dibuat.</p><p className="mt-2">Jalankan SQL <code>supabase/migrations/20261024_members.sql</code> di Supabase SQL Editor, lalu refresh halaman ini.</p></div></div>;
  }
  return <div className="flex flex-col gap-6">
    <Link href="/admin" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-zinc-500 hover:text-emerald-600"><ArrowLeft className="h-4 w-4" />Kembali ke Dashboard Admin</Link>
    <div><h1 className="flex items-center gap-2 text-2xl font-extrabold"><Users className="h-6 w-6 text-emerald-600" />Daftar Anggota Bergabung</h1><p className="mt-1 text-sm text-zinc-500">Data pendaftar dari formulir kontak website.</p></div>
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {error ? <p className="p-5 text-sm text-rose-600">Gagal mengambil data: {error.message}</p> : members.length === 0 ? <p className="p-10 text-center text-sm text-zinc-500">Belum ada orang yang mengisi formulir bergabung.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-800/50"><tr><th className="px-5 py-3">Nama</th><th className="px-5 py-3">Usia</th><th className="px-5 py-3">No. WhatsApp</th><th className="px-5 py-3">Motivasi</th><th className="px-5 py-3">Tanggal</th></tr></thead><tbody>{members.map(item => <tr key={item.id} className="border-t border-zinc-100 align-top dark:border-zinc-800"><td className="px-5 py-4 font-bold">{item.name}</td><td className="px-5 py-4">{item.age} tahun</td><td className="px-5 py-4"><a className="font-semibold text-emerald-600" href={`https://wa.me/${item.phone.replace(/\D/g, "")}`} target="_blank">{item.phone}</a></td><td className="max-w-xs px-5 py-4 text-zinc-600 dark:text-zinc-300">{item.motivation}</td><td className="whitespace-nowrap px-5 py-4 text-zinc-500">{new Date(item.created_at).toLocaleDateString("id-ID")}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}

function AnggotaLoading() {
  return <div className="flex flex-col gap-6"><div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" /><div className="h-64 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" /></div>;
}
