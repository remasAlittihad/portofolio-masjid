"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Quote,
  Sparkles,
  Star,
  Timer,
  Users,
} from "lucide-react";
import { JoinForm } from "./JoinForm";
import { Modal } from "./ui/Modal";
import { Reveal } from "./ui/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import { usePrayer } from "@/context/PrayerContext";
import { fetchTable } from "@/lib/data";
import type { TranslationKey } from "@/lib/i18n";
import { MOCK_QUOTES } from "@/lib/mockData";
import type { Quote as QuoteType } from "@/lib/types";

const STATS = [
  { key: "hero.members" as const, value: "120+", icon: Users },
  { key: "hero.programCount" as const, value: "10", icon: CalendarCheck },
  { key: "hero.eventsCount" as const, value: "24", icon: Star },
];

export function Hero() {
  const { t } = useLanguage();
  const { schedule, next, countdown, city } = usePrayer();

  const [quotes, setQuotes] = useState<QuoteType[]>(MOCK_QUOTES);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [joinOpen, setJoinOpen] = useState(false);
  const tagline = t("common.tagline");
  const [typedTagline, setTypedTagline] = useState("");

  useEffect(() => {
    let index = 0;
    let deleting = false;
    let timeout: number;

    const tick = () => {
      setTypedTagline(tagline.slice(0, index));
      if (!deleting && index < tagline.length) {
        index += 1;
        timeout = window.setTimeout(tick, 85);
      } else if (!deleting) {
        deleting = true;
        timeout = window.setTimeout(tick, 1800);
      } else if (index > 0) {
        index -= 1;
        timeout = window.setTimeout(tick, 45);
      } else {
        deleting = false;
        timeout = window.setTimeout(tick, 500);
      }
    };

    tick();
    return () => window.clearTimeout(timeout);
  }, [tagline]);

  useEffect(() => {
    let cancelled = false;
    fetchTable<QuoteType>("quotes", MOCK_QUOTES).then((rows) => {
      if (cancelled || rows.length === 0) return;
      setQuotes(rows);
      setQuoteIndex(Math.floor(Math.random() * rows.length));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Ganti kutipan setiap kali waktu sholat berikutnya berubah.
  const nextPrayerKey = next?.key;
  const nextPrayerTime = next?.at.getTime();
  useEffect(() => {
    if (quotes.length < 2 || !nextPrayerKey) return;
    const timeout = window.setTimeout(() => {
      setQuoteIndex((current) => {
        let nextIndex = Math.floor(Math.random() * quotes.length);
        while (nextIndex === current) nextIndex = Math.floor(Math.random() * quotes.length);
        return nextIndex;
      });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [nextPrayerKey, nextPrayerTime, quotes.length]);

  const quote = quotes[quoteIndex] ?? MOCK_QUOTES[0];

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white pt-24 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900"
    >
      {/* Decorative Islamic background */}
      <div className="pattern-islamic absolute inset-0 opacity-[0.35] dark:opacity-[0.12]" aria-hidden="true" />
      <div
        className="absolute -top-32 -start-32 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-600/15"
        aria-hidden="true"
      />
      <div
        className="absolute -end-24 top-40 h-80 w-80 rounded-full bg-ir-gold/20 blur-3xl dark:bg-ir-gold/10"
        aria-hidden="true"
      />
      <Star
        className="animate-rotate-slow absolute end-[8%] top-28 hidden h-16 w-16 text-emerald-500/30 md:block"
        aria-hidden="true"
      />
      <Star
        className="animate-float absolute start-[6%] bottom-40 hidden h-10 w-10 text-ir-gold/40 md:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-16">
        {/* ---- Copy ---- */}
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-400/30 dark:bg-zinc-900/70 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5 text-ir-gold" />
              {t("hero.badge")}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-[clamp(2.75rem,11vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-zinc-900 dark:text-white">
              IRMA
              <br />
              <span className="text-gradient">Al-Ittihad</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="relative max-w-xl border-s-4 border-ir-gold ps-4 text-lg font-semibold italic leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-xl">
              <span aria-label={tagline}>
                “{typedTagline}<span className="animate-pulse">|</span>”
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("hero.description")}
            </p>
          </Reveal>

          <Reveal delay={0.3} className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-emerald-600 sm:w-auto sm:px-7 sm:text-base"
            >
              {t("common.joinNow")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#program"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-emerald-600/80 bg-white/70 px-5 py-3.5 text-sm font-bold text-emerald-700 backdrop-blur transition hover:bg-emerald-600 hover:text-white sm:w-auto sm:px-7 sm:text-base dark:border-emerald-400/60 dark:bg-zinc-900/60 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
            >
              {t("common.viewPrograms")}
              <Timer className="h-4 w-4" />
            </a>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.38} className="grid w-full max-w-lg grid-cols-3 gap-2 sm:gap-3">
            {STATS.map(({ key, value, icon: Icon }) => (
              <div
                key={key}
                className="glass rounded-xl px-3 py-3.5 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-white">
                  {value}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t(key)}
                </div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ---- Islamic feature bar ---- */}
        <div className="flex flex-col gap-5 lg:col-span-5">
          {/* Countdown card */}
          <Reveal delay={0.12}>
            <motion.div
              className="glass relative overflow-hidden rounded-xl p-6 shadow-xl shadow-emerald-900/10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="pattern-islamic-gold absolute inset-0 opacity-15" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    <Clock className="h-4 w-4" />
                    {t("hero.countdownTitle")}
                  </span>
                  <span className="rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                    {city}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      {next ? t(next.labelKey as TranslationKey) : "—"}
                    </div>
                    <div className="text-3xl font-extrabold tabular-nums text-zinc-900 dark:text-white">
                      {next?.time ?? "--:--"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-linear-to-br from-emerald-600 to-emerald-500 px-4 py-3 text-center text-white shadow-lg shadow-emerald-600/30">
                    <div className="font-mono text-2xl font-bold tabular-nums tracking-wider">
                      {schedule ? countdown : "--:--:--"}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest opacity-90">
                      menuju
                    </div>
                  </div>
                </div>

                {/* Mini schedule strip */}
                <div className="mt-4 grid grid-cols-5 gap-1.5 text-center text-[11px]">
                  {(schedule
                    ? [
                        ["subuh", schedule.timings.fajr],
                        ["dzuhur", schedule.timings.dhuhr],
                        ["ashar", schedule.timings.asr],
                        ["maghrib", schedule.timings.maghrib],
                        ["isya", schedule.timings.isya],
                      ]
                    : []
                  ).map(([labelKey, time]) => (
                    <div
                      key={labelKey}
                      className={`rounded-lg py-2 transition ${
                        next?.key === labelKey
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "bg-white/70 text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-300"
                      }`}
                    >
                      <div className="font-bold uppercase">{t(labelKey as TranslationKey)}</div>
                      <div className="font-mono tabular-nums">{time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>

          {/* Quote card */}
          <Reveal delay={0.22}>
            <div className="glass group relative overflow-hidden rounded-xl p-6 shadow-xl shadow-emerald-900/10 transition hover:-translate-y-1">
              <div className="absolute -end-6 -top-6 opacity-10" aria-hidden="true">
                <Quote className="h-28 w-28 text-emerald-700" />
              </div>
              <div className="relative flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ir-gold">
                  <Star className="h-4 w-4" />
                  {t("hero.quoteTitle")}
                </span>

              </div>

              <motion.blockquote
                key={quote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="relative mt-3"
              >
                {quote.arabic && (
                  <p
                    dir="rtl"
                    className="mb-3 text-right font-arabic text-xl leading-loose text-emerald-800 dark:text-emerald-300"
                  >
                    {quote.arabic}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base">
                  {quote.text}
                </p>
                <footer className="mt-3 inline-flex items-center gap-2 rounded-full bg-ir-gold/15 px-3 py-1 text-xs font-bold text-ir-gold dark:bg-ir-gold/20">
                  — {quote.source}
                </footer>
              </motion.blockquote>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Registration modal */}
      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} label={t("modal.joinTitle")}>
        <div className="relative p-6 pt-8 sm:p-7 sm:pt-9">
          <div className="pattern-islamic absolute inset-x-0 top-0 h-24 opacity-10" aria-hidden="true" />
          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              IRMA Al-Ittihad
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-white">
              {t("modal.joinTitle")}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("modal.joinSubtitle")}
            </p>
            <div className="mt-5">
              <JoinForm idPrefix="modal-join" compact onSubmitted={() => setJoinOpen(false)} />
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
}
