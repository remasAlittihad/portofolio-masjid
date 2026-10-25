"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Maximize2,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchTable } from "@/lib/data";
import { galleryFallback, imageSrc } from "@/lib/image";
import { MOCK_GALLERY } from "@/lib/mockData";
import type { GalleryItem } from "@/lib/types";

export function Gallery() {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [category, setCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTable<GalleryItem>("gallery", MOCK_GALLERY).then((rows) => {
      if (!cancelled) setItems(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((i) => i.category)));
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => (category === "Semua" ? true : i.category === category))
      .filter((i) => (q ? i.title.toLowerCase().includes(q) : true));
  }, [items, category, query]);

  const active = activeIndex !== null ? filtered[activeIndex] : null;

  const step = (dir: number) => {
    if (activeIndex === null || filtered.length === 0) return;
    setActiveIndex((prev) =>
      prev === null ? null : (prev + dir + filtered.length) % filtered.length,
    );
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, filtered.length]);

  return (
    <section id="galeri" className="relative py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <SectionHeading
          label={t("gallery.label")}
          title={t("gallery.title")}
          subtitle={t("gallery.subtitle")}
        />

        {/* Filters */}
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["Semua", ...categories].map((c) => {
              const activeChip = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
                    activeChip
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {c === "Semua" ? t("common.all") : c}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("gallery.searchPlaceholder")}
              aria-label={t("gallery.searchPlaceholder")}
              className="w-full rounded-full border border-zinc-200 bg-white py-3 ps-11 pe-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </Reveal>

        {/* Grid */}
        {!items ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/3 animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {t("common.noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                whileHover={{ y: -6 }}
                className="group relative aspect-4/3 overflow-hidden rounded-xl shadow-lg transition hover:shadow-2xl"
              >
                <Image
                  src={imageSrc(item.image_url, galleryFallback(item.id))}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-80 transition group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-start">
                  <div>
                    <span className="inline-block rounded-full bg-ir-gold/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                      {item.category}
                    </span>
                    <h3 className="mt-1.5 text-sm font-bold text-white sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-white/70">
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition group-hover:bg-emerald-500">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIndex(null)}
            />
            <motion.figure
              key={active.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative z-10 w-full max-w-4xl"
            >
              <Image
                src={imageSrc(active.image_url, galleryFallback(active.id))}
                alt={active.title}
                width={1200}
                height={900}
                unoptimized
                className="mx-auto max-h-[75vh] w-auto max-w-full rounded-xl object-contain"
              />
              <figcaption className="mt-4 flex flex-col items-center gap-1 text-center text-white">
                <span className="rounded-full bg-ir-gold px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wide">
                  {active.category}
                </span>
                <h3 className="text-lg font-extrabold">{active.title}</h3>
                <p className="text-sm text-white/60">
                  {new Date(active.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </figcaption>

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={() => step(-1)}
                    className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-emerald-500"
                  >
                    <ChevronLeft className="h-6 w-6 flip-x" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={() => step(1)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-emerald-500"
                  >
                    <ChevronRight className="h-6 w-6 flip-x" />
                  </button>
                  <span className="absolute end-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white tabular-nums">
                    {(activeIndex ?? 0) + 1} / {filtered.length}
                  </span>
                </>
              )}
            </motion.figure>

            <button
              type="button"
              aria-label={t("common.close")}
              onClick={() => setActiveIndex(null)}
              className="absolute end-5 top-5 z-20 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-rose-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
      </AnimatePresence>

      {!items && (
        <span className="sr-only">
          <Images />
        </span>
      )}
    </section>
  );
}
