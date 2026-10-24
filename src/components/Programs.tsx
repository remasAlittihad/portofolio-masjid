"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileDown,
  MapPin,
  PackageCheck,
  PlayCircle,
  Search,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { fetchTable } from "@/lib/data";
import { MOCK_PROGRAMS } from "@/lib/mockData";
import { exportProgramsPdf } from "@/lib/pdf";
import type { Program, ProgramCategory, ProgramStatus } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

const CATEGORIES: (ProgramCategory | "Semua")[] = [
  "Semua",
  "Keagamaan",
  "Sosial",
  "Pelatihan",
  "Olahraga",
];

const STATUS_META: Record<
  ProgramStatus,
  { labelKey: TranslationKey; className: string; icon: typeof Clock }
> = {
  "Akan Datang": {
    labelKey: "programs.statusUpcoming",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    icon: Clock,
  },
  Berlangsung: {
    labelKey: "programs.statusOngoing",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: PlayCircle,
  },
  Selesai: {
    labelKey: "programs.statusDone",
    className:
      "border-slate-300 bg-slate-100 text-slate-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    icon: CheckCircle2,
  },
};

const CATEGORY_LABELS: Record<ProgramCategory, TranslationKey> = {
  Keagamaan: "programs.catKeagamaan",
  Sosial: "programs.catSosial",
  Pelatihan: "programs.catPelatihan",
  Olahraga: "programs.catOlahraga",
};

const CATEGORY_ACCENT: Record<ProgramCategory, string> = {
  Keagamaan: "from-emerald-600 to-emerald-500",
  Sosial: "from-rose-500 to-rose-400",
  Pelatihan: "from-indigo-600 to-indigo-500",
  Olahraga: "from-ir-gold to-ir-gold-light",
};

export function Programs() {
  const { t } = useLanguage();
  const [programs, setPrograms] = useState<Program[] | null>(null);
  const [category, setCategory] = useState<ProgramCategory | "Semua">("Semua");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTable<Program>("programs", MOCK_PROGRAMS).then((rows) => {
      if (!cancelled) setPrograms(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!programs) return [];
    const q = query.trim().toLowerCase();
    return programs
      .filter((p) => (category === "Semua" ? true : p.category === category))
      .filter((p) =>
        q
          ? p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [programs, category, query]);

  const handleExport = () => {
    if (!filtered.length) return;
    exportProgramsPdf(filtered);
    setToast(true);
    window.setTimeout(() => setToast(false), 2600);
  };

  return (
    <section id="program" className="relative py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <SectionHeading
          label={t("programs.label")}
          title={t("programs.title")}
          subtitle={t("programs.subtitle")}
        />

        {/* Toolbar */}
        <Reveal className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c;
              const label = c === "Semua" ? t("common.all") : t(CATEGORY_LABELS[c]);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-xl border px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("programs.searchPlaceholder")}
                aria-label={t("programs.searchPlaceholder")}
                className="w-full rounded-full border border-zinc-200 bg-white py-3 ps-11 pe-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 sm:w-64 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-ir-gold to-ir-gold-light px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-600/25 transition hover:brightness-110"
            >
              <FileDown className="h-4 w-4" />
              {t("common.downloadPdf")}
            </button>
          </div>
        </Reveal>

        <Reveal className="-mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {filtered.length} {t("programs.found")}
        </Reveal>

        {/* Cards */}
        {!programs ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {t("common.noResults")}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((program, i) => {
              const status = STATUS_META[program.status];
              const StatusIcon = status.icon;
              return (
                <motion.article
                  key={program.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.35) }}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-md transition hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Accent strip */}
                  <div
                    className={`h-1.5 w-full bg-linear-to-r ${CATEGORY_ACCENT[program.category]}`}
                  />
                  <div className="pattern-islamic absolute -end-8 -top-8 h-32 w-32 opacity-[0.07] transition group-hover:opacity-[0.14]" />

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        {t(CATEGORY_LABELS[program.category])}
                      </span>
                      <span
                        className={`ms-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {t(status.labelKey)}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold leading-snug text-zinc-900 dark:text-white">
                      {program.title}
                    </h3>
                    <p className="flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {program.description}
                    </p>

                    <div className="mt-2 flex flex-col gap-1.5 border-t border-dashed border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        {new Date(program.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-ir-gold" />
                        {program.location}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Export toast */}
      <motion.div
        initial={false}
        animate={{ opacity: toast ? 1 : 0, y: toast ? 0 : 24 }}
        transition={{ duration: 0.25 }}
        className={`fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-2xl ${
          toast ? "pointer-events-auto" : "pointer-events-none"
        }`}
        role="status"
      >
        <span className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4" />
          {t("programs.exportSuccess")}
        </span>
      </motion.div>
    </section>
  );
}
