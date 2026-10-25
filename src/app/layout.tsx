import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import { AppProviders } from "@/context/AppProviders";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRMA Al-Ittihad — Bukan Sekedar Muda, Tapi Juga Bermakna",
  description:
    "Web portfolio resmi Ikatan Remaja Masjid (IRMA) Al-Ittihad — wadah pemuda masjid yang beriman, aktif, kreatif, dan bermanfaat. Program kerja, galeri, jadwal sholat, dan transparansi kas dalam satu tempat.",
  keywords: [
    "IRMA Al-Ittihad",
    "Ikatan Remaja Masjid",
    "pemuda masjid",
    "organisasi pemuda islam",
    "kegiatan remaja masjid",
  ],
  openGraph: {
    title: "IRMA Al-Ittihad",
    description: "Bukan Sekedar Muda, Tapi Juga Bermakna",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#022c22" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      dir="ltr"
      suppressHydrationWarning
      className={`${jakarta.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-100 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
