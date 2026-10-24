import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

/**
 * Layout untuk seluruh rute /admin.
 *
 * `robots: { index: false }` + proxy.ts (header X-Robots-Tag) + robots.txt
 * bekerja sama memastikan halaman admin tidak muncul di hasil pencarian
 * Google.
 */
export const metadata: Metadata = {
  title: "Admin — IRMA Al-Ittihad",
  description: "Panel admin pengelolaan data IRMA Al-Ittihad.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <Logo className="h-8 w-8" />
          <div className="leading-tight">
            <p className="text-sm font-extrabold">Panel Admin</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              IRMA Al-Ittihad
            </p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
