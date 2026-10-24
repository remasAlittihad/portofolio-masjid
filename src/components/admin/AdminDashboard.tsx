"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Images, Library, Loader2, LogOut, UserCog, BarChart3 } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import type { MediaEntry } from "@/app/admin/actions";
import type { Executive, GalleryItem, Program } from "@/lib/types";
import { ProgramManager } from "./ProgramManager";
import { GalleryManager } from "./GalleryManager";
import { PengurusManager } from "./PengurusManager";
import { DataChart } from "./DataChart";

type TabKey = "grafik" | "galeri" | "pengurus" | "program";

const TABS: { key: TabKey; label: string; icon: typeof Library }[] = [
  { key: "grafik", label: "Grafik Data", icon: BarChart3 },
  { key: "program", label: "Program Kerja", icon: CalendarDays },
  { key: "galeri", label: "Galeri", icon: Images },
  { key: "pengurus", label: "Pengurus", icon: UserCog },
];

interface AdminDashboardProps {
  email: string;
  initialGallery: GalleryItem[];
  initialExecutives: Executive[];
  initialPrograms: Program[];
  programsError: string | null;
  initialMedia: MediaEntry[];
  galleryError: string | null;
  executivesError: string | null;
}

export function AdminDashboard({
  email,
  initialGallery,
  initialExecutives,
  initialPrograms,
  programsError,
  galleryError,
  executivesError,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<TabKey>("grafik");
  const [isLoggingOut, startLogout] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
      router.push("/admin/login");
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar atas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Kelola Data</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Masuk sebagai{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {email}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Keluar
        </button>
      </div>

      {/* Tab navigasi */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                active
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <a href="/admin/anggota" className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">Daftar Anggota</a>
        <a href="/admin/kas" className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">Kas Masjid</a>
      </div>

      {/* Konten tab */}
      <div>
        {tab === "grafik" && (
          <DataChart programs={initialPrograms} gallery={initialGallery} executives={initialExecutives} />
        )}
        {tab === "program" && <ProgramManager items={initialPrograms} error={programsError} />}
        {tab === "galeri" && (
          <GalleryManager items={initialGallery} error={galleryError} />
        )}
        {tab === "pengurus" && (
          <PengurusManager
            items={initialExecutives}
            error={executivesError}
          />
        )}
      </div>
    </div>
  );
}
