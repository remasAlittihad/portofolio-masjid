"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  Compass,
  HeartHandshake,
  Moon,
  Sunrise,
  Sunset,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { usePrayer } from "@/context/PrayerContext";
import { useNow } from "@/hooks/useNow";
import { MOCK_EVENTS } from "@/lib/mockData";
import type { UpcomingEvent } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

const PRAYER_ROWS: { key: string; labelKey: TranslationKey; icon: typeof Sunrise }[] = [
  { key: "fajr", labelKey: "schedule.subuh", icon: Sunrise },
  { key: "dhuhr", labelKey: "schedule.dzuhur", icon: Compass },
  { key: "asr", labelKey: "schedule.ashar", icon: Sunset },
  { key: "maghrib", labelKey: "schedule.maghrib", icon: Sunset },
  { key: "isya", labelKey: "schedule.isya", icon: Moon },
];

/** First event that lies ahead of `now` (pure: only parses static data). */
function getUpcomingEvent(now: number | null): UpcomingEvent {
  const sorted = [...MOCK_EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  if (now === null) return sorted[0];
  return sorted.find((e) => new Date(e.date).getTime() > now) ?? sorted[sorted.length - 1];
}

export function Schedule() {
  const { t } = useLanguage();
  const { schedule, city, next } = usePrayer();
  const now = useNow(1000);

  const event = useMemo(() => getUpcomingEvent(now), [now]);
  const eventTime = new Date(event.date).getTime();
  const diff = now === null ? 0 : Math.max(0, eventTime - now);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const units = [
    { value: days, label: t("schedule.days") },
    { value: hours, label: t("schedule.hours") },
    { value: minutes, label: t("schedule.minutes") },
    { value: seconds, label: t("schedule.seconds") },
  ];

  const timeFor = (key: string): string => {
    if (!schedule) return "--:--";
    switch (key) {
      case "fajr":
        return schedule.timings.fajr;
      case "dhuhr":
        return schedule.timings.dhuhr;
      case "asr":
        return schedule.timings.asr;
      case "maghrib":
        return schedule.timings.maghrib;
      default:
        return schedule.timings.isya;
    }
  };

  return (
    <section id="jadwal" className="relative overflow-hidden py-20 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950" aria-hidden="true" />
      <div className="pattern-islamic absolute inset-0 opacity-[0.09]" aria-hidden="true" />
      <div
        className="absolute -end-32 top-1/3 h-96 w-96 rounded-full bg-ir-gold/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
              <Timer className="h-3.5 w-3.5 text-ir-gold-light" />
              {t("schedule.label")}
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("schedule.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="gold-rule h-0.5 w-24 rounded-full" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Prayer schedule */}
          <Reveal>
            <div className="glass h-full rounded-xl p-6 shadow-2xl sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  {t("schedule.prayerTitle")}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  <Compass className="h-3.5 w-3.5" />
                  {t("schedule.city")}: {city}
                </span>
              </div>

              <ul className="mt-5 flex flex-col gap-2.5">
                {PRAYER_ROWS.map(({ key, labelKey, icon: Icon }) => {
                  const activeRow = next?.key === key;
                  return (
                    <motion.li
                      key={key}
                      initial={false}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition ${
                        activeRow
                          ? "border-emerald-500 bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                          : "border-zinc-200/80 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/70"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            activeRow
                              ? "bg-white/20 text-white"
                              : "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-sm font-bold sm:text-base">
                          {t(labelKey)}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-lg font-extrabold tabular-nums">
                          {timeFor(key)}
                        </span>
                        {activeRow && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {schedule?.live ? (
                  <>
                    <Wifi className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {t("schedule.liveNote")}
                  </>
                ) : (
                  <>
                    <WifiOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    {t("schedule.offlineNote")}
                  </>
                )}
              </p>
            </div>
          </Reveal>

          {/* Event countdown */}
          <Reveal delay={0.12}>
            <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/95 p-6 shadow-2xl sm:p-7 dark:bg-zinc-950/80">
              <div className="pattern-islamic-gold absolute inset-0 opacity-10" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-ir-gold/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-ir-gold dark:bg-ir-gold/20">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {t("schedule.upcoming")}
                </span>

                <h3 className="mt-4 text-2xl font-extrabold leading-snug text-zinc-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {event.description}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {new Date(event.date).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <div className="mt-6 grid grid-cols-4 gap-2.5 sm:gap-3">
                  {units.map(({ value, label }) => (
                    <motion.div
                      key={label}
                      className="rounded-xl bg-linear-to-b from-emerald-700 to-emerald-600 px-1 py-4 text-center text-white shadow-lg shadow-emerald-900/30"
                    >
                      <div className="text-2xl font-extrabold tabular-nums sm:text-3xl">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-85">
                        {label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-dashed border-emerald-600/40 bg-emerald-600/5 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                    <HeartHandshake className="h-4 w-4 text-ir-gold" />
                    Info Masjid Al-Ittihad
                  </h4>
                  <ul className="mt-3 grid gap-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Kajian dan kegiatan keagamaan rutin
                    </li>
                    <li className="flex items-start gap-2">
                      <HeartHandshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Terbuka untuk seluruh jemaah
                    </li>
                    <li className="flex items-start gap-2">
                      <HeartHandshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Kegiatan sosial untuk masyarakat
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      Wadah pemuda yang aktif dan kreatif
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
