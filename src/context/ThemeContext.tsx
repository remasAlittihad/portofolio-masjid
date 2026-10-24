"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";

/**
 * ThemeContext (Light / Dark) — built on top of `next-themes`.
 * Exposes a simple `theme` + `toggleTheme` API for the header controls.
 */

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  /** Resolved effective theme ("light" | "dark"), null while hydrating. */
  resolvedTheme: "light" | "dark" | undefined;
  theme: string | undefined;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContextProviderInternal>{children}</ThemeContextProviderInternal>
  );
}

function ThemeContextProviderInternal({ children }: { children: ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Track resolved value for consumers that need mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: mounted ? theme : undefined,
        resolvedTheme: mounted ? (resolvedTheme as "light" | "dark") : undefined,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within <ThemeProvider>");
  }
  return ctx;
}
