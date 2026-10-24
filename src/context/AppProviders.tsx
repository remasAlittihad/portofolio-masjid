"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProvider } from "./ThemeContext";
import { LanguageProvider } from "./LanguageContext";
import { PrayerProvider } from "./PrayerContext";

/**
 * Combines all global providers:
 *  - next-themes (dark mode, class strategy) wrapped by our ThemeContext
 *  - LanguageContext (ID / AR / EN with RTL support)
 *  - PrayerProvider (shared prayer times + countdown)
 */
export function AppProviders({ children }: { children: ReactNode }) {
  // Penanda bahwa React sudah berhasil hydrate di browser.
  // CSS fallback di globals.css hanya menyala kalau tanda ini tidak pernah
  // muncul (JS gagal jalan / chunk gagal load) — supaya halaman tidak "polos".
  useEffect(() => {
    document.documentElement.classList.add("ir-hydrated");
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      /**
       * React 19 meminta <script> yang dirender client memakai tipe data-block
       * (bukan MIME JS) agar tidak memunculkan error "Encountered a script tag
       * while rendering React component". Di server tetap "text/javascript"
       * sehingga script anti-flash tema dieksekusi saat parse HTML — lihat
       * panduan Next.js "Preventing flash before hydration".
       * `suppressHydrationWarning` sudah di-set next-themes untuk mismatch tipenya.
       */
      scriptProps={{
        type: typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
    >
      <ThemeProvider>
        <LanguageProvider>
          <PrayerProvider>{children}</PrayerProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}
