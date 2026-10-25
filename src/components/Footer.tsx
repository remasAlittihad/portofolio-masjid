"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Heart, MapPin, Phone, Send } from "lucide-react";
import { Logo } from "./ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "./ui/BrandIcons";
import { useLanguage } from "@/context/LanguageContext";
import { APP_CONFIG } from "@/lib/supabaseClient";
import type { TranslationKey } from "@/lib/i18n";

const FOOTER_LINKS: { id: string; key: TranslationKey }[] = [
  { id: "beranda", key: "nav.home" },
  { id: "tentang", key: "nav.about" },
  { id: "pengurus", key: "nav.team" },
  { id: "program", key: "nav.programs" },
  { id: "galeri", key: "nav.gallery" },
  { id: "jadwal", key: "nav.schedule" },
  { id: "kontak", key: "nav.contact" },
];

export function Footer() {
  const { t } = useLanguage();
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setYear(new Date().getFullYear()), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-300">
      <div className="pattern-islamic absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-600 via-ir-gold to-emerald-600" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Brand */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div>
              <div className="text-lg font-extrabold text-white">IRMA Al-Ittihad</div>
              <div className="text-xs text-emerald-400">Ikatan Remaja Masjid Al-Ittihad</div>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            “{t("common.tagline")}”
          </p>
          <div className="flex items-center gap-2.5">
            {[
              { href: `https://wa.me/${APP_CONFIG.whatsappNumber}`, icon: WhatsAppIcon, label: "WhatsApp" },
              { href: "https://www.instagram.com/remajamesjidalittihad?obrf=MWNpYW9mcjkwcnY5cg%3D%3D&utm_source=qr", icon: InstagramIcon, label: "Instagram" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-white/15 p-2.5 text-zinc-300 transition hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-white">
            {t("footer.nav")}
          </h4>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {FOOTER_LINKS.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm text-zinc-400 transition hover:text-emerald-400"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-white">
            {t("footer.contact")}
          </h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ir-gold" />
              {APP_CONFIG.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-ir-gold" />
              <a
                href={`https://wa.me/${APP_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-emerald-400"
                dir="ltr"
              >
                +{APP_CONFIG.whatsappNumber}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Send className="h-4 w-4 shrink-0 text-ir-gold" />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=irma.alittihad1998@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-emerald-400"
              >
                irma.alittihad1998@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row">
          <p>
            © {year} IRMA Al-Ittihad — {t("footer.rights")}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t("footer.built")}
            <Heart className="h-3.5 w-3.5 text-rose-500" />
          </p>
          <a
            href="#beranda"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 font-semibold text-zinc-300 transition hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}
