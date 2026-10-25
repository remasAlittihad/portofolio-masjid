"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Globe,
  Languages,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Logo } from "./ui/Logo";
import { useLanguage } from "@/context/LanguageContext";
import { useThemeContext } from "@/context/ThemeContext";
import { usePrayer } from "@/context/PrayerContext";
import { LANGUAGE_LABELS, type TranslationKey } from "@/lib/i18n";
import type { Language } from "@/lib/types";

const NAV_ITEMS: { id: string; key: TranslationKey }[] = [
  { id: "beranda", key: "nav.home" },
  { id: "tentang", key: "nav.about" },
  { id: "pengurus", key: "nav.team" },
  { id: "program", key: "nav.programs" },
  { id: "galeri", key: "nav.gallery" },
  { id: "jadwal", key: "nav.schedule" },
  { id: "kas", key: "nav.finance" },
  { id: "kontak", key: "nav.contact" },
];

export function Header() {
  const { t, lang, setLang } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const { schedule, next, countdown, city } = usePrayer();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  // A refresh should start from the home section instead of preserving the
  // hash from the section that was open before the refresh.
  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigation?.type === "reload";

    if (isReload && window.location.hash) {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        setActiveSection("beranda");
      });
    }
  }, []);

  // Track scroll state for the frosted header
  useEffect(() => {
    let frame = 0;
    let last = false;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 24;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Close menus on route/section change or resize
  useEffect(() => {
    const close = () => {
      setMobileOpen(false);
      setLangOpen(false);
    };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const nextPrayerLabel = next ? t(next.labelKey as TranslationKey) : "—";


  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ minHeight: "6rem" }}>
      {/* ---- Prayer times widget bar ---- */}
      <div className="bg-linear-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white dark:from-zinc-950 dark:via-emerald-950 dark:to-zinc-950">
        <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-between gap-2 px-3 text-[10px] sm:gap-3 sm:px-4 sm:text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ir-green-light opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ir-green-light" />
            </span>
            <span className="truncate font-medium text-emerald-100">
              {city}
              {schedule?.live === false ? " · offline" : ""}
            </span>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-3">
            <Clock className="hidden h-3.5 w-3.5 text-ir-gold-light sm:block" />
            <span className="hidden font-semibold text-white sm:inline">
              {t("common.nextPrayer")}:
            </span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 font-medium">
              {nextPrayerLabel}
              {next && <span className="mx-1 text-emerald-200">·</span>}
              {next?.time ?? "--:--"}
            </span>
            <span className="rounded-md bg-ir-gold px-2 py-0.5 font-mono font-bold tracking-wider text-white tabular-nums">
              {schedule ? countdown : "--:--:--"}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Main navigation ---- */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "glass-strong shadow-lg shadow-emerald-900/5"
            : "bg-white/70 dark:bg-zinc-950/60"
        } border-b border-emerald-900/10 backdrop-blur-xl dark:border-white/10`}
      >
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-6" dir={lang === "ar" ? "rtl" : "ltr"}>
          {/* Logo */}
          <a href="#beranda" className="flex shrink-0 items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-base">
                IRMA Al-Ittihad
              </span>
              <span className="hidden text-[10px] font-medium text-emerald-700 dark:text-emerald-400 sm:block">
                {t("common.tagline")}
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1 xl:flex" dir={lang === "ar" ? "rtl" : "ltr"}>
            {NAV_ITEMS.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`relative block whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold leading-none transition-colors xl:px-2.5 xl:text-sm ${
                    activeSection === id
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-400"
                  }`}
                >
                  {t(key)}
                  {activeSection === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-emerald-500 to-ir-gold"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={`ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 xl:gap-2 ${lang === "ar" ? "mr-5 sm:mr-3 max-xl:-translate-x-12" : ""}`}>
            {/* Language switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t("common.language")}
                aria-expanded={langOpen}
                className="flex items-center gap-1 rounded-full border border-emerald-700/20 bg-white/70 px-2.5 py-2 text-xs font-bold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-white/15 dark:bg-zinc-900/70 dark:text-emerald-400 sm:px-3"
              >
                <Languages className="h-4 w-4" />
                <span className="hidden min-w-6 text-center sm:inline">{lang.toUpperCase()}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-44 overflow-hidden rounded-xl border border-emerald-900/10 bg-white py-1.5 text-start shadow-xl dark:border-white/10 dark:bg-zinc-900" dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {(Object.keys(LANGUAGE_LABELS) as Language[]).map((code) => (
                      <li key={code}>
                        <button
                          type="button"
                          onClick={() => {
                            setLang(code);
                            setLangOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-start text-sm font-medium transition-colors ${
                            lang === code
                              ? "bg-emerald-600 text-white"
                              : "text-zinc-700 hover:bg-emerald-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                          }`}
                        >
                          {LANGUAGE_LABELS[code]}
                          {lang === code && <Globe className="h-3.5 w-3.5" />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("common.toggleTheme")}
              className="rounded-full border border-emerald-700/20 bg-white/70 p-2 text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-white/15 dark:bg-zinc-900/70 dark:text-emerald-400"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Join CTA */}
            <a
              href="#kontak"
              className="hidden items-center gap-1 rounded-full bg-linear-to-r from-emerald-600 to-emerald-500 px-3 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-emerald-600 xl:flex xl:px-3.5 xl:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              {t("common.joinNow")}
            </a>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="relative z-10 rounded-full border border-emerald-700/20 bg-white/70 p-2 text-emerald-800 xl:hidden dark:border-white/15 dark:bg-zinc-900/70 dark:text-emerald-400"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              id="mobile-navigation"
              className={`relative z-20 overflow-hidden border-t border-emerald-900/10 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 xl:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            >
              <ul className="mx-auto grid max-h-[70vh] max-w-7xl gap-1 overflow-y-auto p-4">
                {NAV_ITEMS.map(({ id, key }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        activeSection === id
                          ? "bg-emerald-600 text-white"
                          : "text-zinc-700 hover:bg-emerald-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {t(key)}
                      <span className="text-xs opacity-60">
                        {String(NAV_ITEMS.findIndex((n) => n.id === id) + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#kontak"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-sm font-bold text-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t("common.joinNow")}
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
