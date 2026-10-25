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
    <section id="tentang" className="section-rule relative scroll-mt-28 overflow-hidden bg-[#f7f5ef] py-24 sm:py-32 dark:bg-[#12201d]">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4">
        <SectionHeading
          label={t("about.label")}
          title={t("about.title")}
          subtitle={t("about.subtitle")}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visi */}
          <Reveal>
            <motion.article
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden border-t-2 border-ir-green-dark bg-white p-6 transition-shadow hover:shadow-xl sm:p-7 dark:bg-[#19352e]"
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
              className="relative h-full overflow-hidden border-t-2 border-ir-gold bg-white p-6 transition-shadow hover:shadow-xl sm:p-7 dark:bg-[#19352e]"
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
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {VALUES.map(({ key, desc, icon: Icon }, i) => (
            <Reveal key={key} delay={0.08 * i}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass flex h-full flex-col items-center gap-1.5 rounded-xl p-3 text-center transition sm:gap-2 sm:p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 sm:h-12 sm:w-12 sm:rounded-xl dark:bg-emerald-500/15 dark:text-emerald-400">
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <h4 className="text-xs font-extrabold text-zinc-900 sm:text-lg dark:text-white">
                  {t(key)}
                </h4>
                <p className="text-[10px] leading-tight text-zinc-500 sm:text-sm sm:leading-normal dark:text-zinc-400">{t(desc)}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
