"use client";

import { motion } from "framer-motion";
import { BookOpen, Eye, Gem, Handshake, Lightbulb, Target } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

const VALUES = [
  { key: "about.value1", desc: "about.value1Desc", icon: Gem },
  { key: "about.value2", desc: "about.value2Desc", icon: Handshake },
  { key: "about.value3", desc: "about.value3Desc", icon: Lightbulb },
] as const;

export function About() {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="relative scroll-mt-28 overflow-hidden py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-emerald-50/60 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900"
        aria-hidden="true"
      />
      <div
        className="pattern-islamic pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.08]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4">
        <SectionHeading
          label={t("about.label")}
          title={t("about.title")}
          subtitle={t("about.subtitle")}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Visi */}
          <Reveal>
            <motion.article
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-emerald-600/20 bg-white p-6 shadow-lg shadow-emerald-900/5 transition-shadow hover:shadow-xl sm:p-7 dark:border-emerald-400/15 dark:bg-zinc-900"
            >
              <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/30">
                    <Eye className="h-7 w-7" />
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    {t("about.visiLabel")}
                  </h3>
                </div>
                <p className="mt-14 text-center text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
                  {t("about.visi")}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-6 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                <Target className="h-4 w-4 text-ir-gold" />
                IRMA Al-Ittihad
              </div>
            </motion.article>
          </Reveal>

          {/* Misi */}
          <Reveal delay={0.12}>
            <motion.article
              whileHover={{ y: -6 }}
              className="relative h-full overflow-hidden rounded-xl border border-emerald-600/20 bg-white p-6 shadow-lg shadow-emerald-900/5 transition-shadow hover:shadow-xl sm:p-7 dark:border-emerald-400/15 dark:bg-zinc-900"
            >
              <div className="absolute -start-10 -top-10 h-40 w-40 rounded-full bg-ir-gold/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-ir-gold to-ir-gold-light text-white shadow-lg shadow-amber-600/30">
                    <BookOpen className="h-7 w-7" />
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-ir-gold">
                    {t("about.misiLabel")}
                  </h3>
                </div>
                <ol className="mt-5 flex flex-col gap-3">
                  {([1, 2, 3] as const).map((n) => (
                    <li
                      key={n}
                      className="flex items-start gap-3 rounded-xl bg-emerald-50/70 p-3.5 transition hover:bg-emerald-100 dark:bg-zinc-800/70 dark:hover:bg-zinc-800"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
                        {n}
                      </span>
                      <span className="text-center text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">
                        {t(`about.misi${n}` as "about.misi1" | "about.misi2" | "about.misi3")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.article>
          </Reveal>
        </div>

        {/* Values */}
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map(({ key, desc, icon: Icon }, i) => (
            <Reveal key={key} delay={0.08 * i}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass flex flex-col items-center gap-2 rounded-xl p-6 text-center transition"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Icon className="h-6 w-6" />
                </span>
                <h4 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  {t(key)}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t(desc)}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
