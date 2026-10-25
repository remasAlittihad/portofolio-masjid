"use client";

import { MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { JoinForm } from "./JoinForm";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { InstagramIcon, WhatsAppIcon } from "./ui/BrandIcons";
import { useLanguage } from "@/context/LanguageContext";
import { APP_CONFIG } from "@/lib/supabaseClient";

const CONTACT_ITEMS = [
  {
    key: "contact.addressLabel" as const,
    value: APP_CONFIG.address,
    icon: MapPin,
    href: null,
  },
  {
    key: "contact.phoneLabel" as const,
    value: `+${APP_CONFIG.whatsappNumber.replace(/^62/, "62")}`,
    icon: Phone,
    href: `https://wa.me/${APP_CONFIG.whatsappNumber}`,
  },
  {
    key: "contact.instagramLabel" as const,
    value: "@remajamesjidalittihad",
    icon: InstagramIcon,
    href: "https://www.instagram.com/remajamesjidalittihad?obrf=MWNpYW9mcjkwcnY5cg%3D%3D&utm_source=qr",
  },
  {
    key: "contact.emailLabel" as const,
    value: "irma.alittihad1998@gmail.com",
    icon: Send,
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=irma.alittihad1998@gmail.com",
  },
];

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="kontak" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-100 to-emerald-50/80 dark:from-zinc-900 dark:to-zinc-950" aria-hidden="true" />
      <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.07]" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4">
        <SectionHeading
          label={t("contact.label")}
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* WhatsApp form */}
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-xl border border-emerald-600/20 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8 dark:border-emerald-400/15 dark:bg-zinc-900">
              <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t("contact.formTitle")}
                </span>
                <h3 className="mt-3 text-xl font-extrabold text-zinc-900 dark:text-white">
                  {t("modal.joinTitle")}
                </h3>
                <p className="mb-5 mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {t("modal.joinSubtitle")}
                </p>
                <JoinForm idPrefix="contact-join" />
              </div>
            </div>
          </Reveal>

          {/* Info + map */}
          <Reveal delay={0.12} className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {CONTACT_ITEMS.map(({ key, value, icon: Icon, href }) => {
                const body = (
                  <span className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                        {t(key)}
                      </span>
                      <span className="block break-words text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {value}
                      </span>
                    </span>
                  </span>
                );

                return href ? (
                  <a
                    key={key}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {body}
                  </a>
                ) : (
                  <div
                    key={key}
                    className="group rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {body}
                  </div>
                );
              })}
            </div>

            {/* Google Maps */}
            <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                  <MapPin className="h-4 w-4 text-ir-gold" />
                  {t("contact.mapTitle")}
                </h3>
                <a
                  href={
                    APP_CONFIG.mapEmbedUrl.includes("/maps?q=")
                      ? APP_CONFIG.mapEmbedUrl.replace("&output=embed", "")
                      : "https://www.google.com/maps"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400"
                >
                  Google Maps
                  <Sparkles className="h-3 w-3" />
                </a>
              </div>
              <iframe
                src={APP_CONFIG.mapEmbedUrl}
                title={t("contact.mapTitle")}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>
          </Reveal>
        </div>

        {/* Bottom banner */}
        <Reveal>
          <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-emerald-700 via-emerald-600 to-emerald-700 px-6 py-8 text-center shadow-2xl shadow-emerald-900/20 sm:px-10">
            <div className="pattern-islamic pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-4">
              <h3 className="max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
                {t("common.tagline")}
              </h3>
              <a
                href={`https://wa.me/${APP_CONFIG.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-emerald-700 shadow-lg transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <WhatsAppIcon className="h-5 w-5 text-emerald-600" />
                {t("common.joinNow")}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
