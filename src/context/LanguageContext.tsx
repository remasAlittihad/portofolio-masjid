"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type TranslationKey } from "@/lib/i18n";
import type { Language } from "@/lib/types";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "irma-lang";

function readStoredLang(): Language {
  if (typeof window === "undefined") return "id";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "ar" || stored === "en" || stored === "id" ? stored : "id";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  // Hydrate from localStorage after mount (avoids SSR/CSR mismatch)
  useEffect(() => {
    const id = window.setTimeout(() => setLangState(readStoredLang()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Keep <html lang> and <html dir> in sync (RTL for Arabic)
  useEffect(() => {
    const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] ?? translations.id[key],
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within <LanguageProvider>");
  }
  return ctx;
}
