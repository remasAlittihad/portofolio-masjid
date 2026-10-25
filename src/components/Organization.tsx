"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AtSign,
  Award,
  BadgeCheck,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { Modal } from "./ui/Modal";
import { PersonPhoto } from "./ui/PersonPhoto";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { InstagramIcon, WhatsAppIcon } from "./ui/BrandIcons";
import { useLanguage } from "@/context/LanguageContext";
import { fetchTable } from "@/lib/data";
import { MOCK_EXECUTIVES } from "@/lib/mockData";
import type { Executive, ExecutiveRole } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

type RoleFilter = "Semua" | ExecutiveRole;

const ROLE_ORDER: Record<ExecutiveRole, number> = {
  Pembina: 0,
  Ketua: 1,
  BPH: 2,
  Anggota: 3,
};

/** Distinct visual identity per role */
const ROLE_STYLES: Record<
  ExecutiveRole,
  { badge: string; ring: string; icon: typeof User; labelKey: TranslationKey }
> = {
  Pembina: {
    badge: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    ring: "ring-2 ring-ir-gold/60 shadow-lg shadow-amber-500/15",
    icon: Award,
    labelKey: "org.rolePembina",
  },
  Ketua: {
    badge: "bg-linear-to-r from-emerald-600 to-emerald-500 text-white border-emerald-600",
    ring: "ring-2 ring-emerald-500/70 shadow-lg shadow-emerald-600/20",
    icon: BadgeCheck,
    labelKey: "org.roleKetua",
  },
  BPH: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    ring: "ring-1 ring-emerald-500/40",
    icon: ShieldCheck,
    labelKey: "org.roleBPH",
  },
  Anggota: {
    badge: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-zinc-700/60 dark:text-zinc-300 dark:border-zinc-600",
    ring: "ring-1 ring-slate-300/60 dark:ring-zinc-600",
    icon: User,
    labelKey: "org.roleAnggota",
  },
};

export function Organization() {
  const { t } = useLanguage();
  const [people, setPeople] = useState<Executive[] | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("Semua");
  const [selected, setSelected] = useState<Executive | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTable<Executive>("executives", MOCK_EXECUTIVES).then((rows) => {
      if (!cancelled) setPeople(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!people) return [];
    const q = query.trim().toLowerCase();
    return people
      .filter((p) => (role === "Semua" ? true : p.role === role))
      .filter((p) =>
        q
          ? p.name.toLowerCase().includes(q) ||
            p.position.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);
  }, [people, query, role]);

  const roles: (RoleFilter)[] = ["Semua", "Pembina", "Ketua", "BPH", "Anggota"];

  return (
    <section id="pengurus" className="relative py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <SectionHeading
          label={t("org.label")}
          title={t("org.title")}
          subtitle={t("org.subtitle")}
        />

        {/* Toolbar: search + role filter */}
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("org.searchPlaceholder")}
              aria-label={t("org.searchPlaceholder")}
              className="w-full rounded-full border border-zinc-200 bg-white py-3 ps-11 pe-4 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="me-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
              {t("org.roleFilter")}
            </span>
            {roles.map((r) => {
              const active = role === r;
              const label =
                r === "Semua"
                  ? t("common.all")
                  : t(ROLE_STYLES[r].labelKey);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Cards */}
        {!people ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-xl bg-zinc-200/70 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {t("common.noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((person, i) => {
              const style = ROLE_STYLES[person.role];
              const RoleIcon = style.icon;
              return (
                <motion.button
                  key={person.id}
                  type="button"
                  onClick={() => setSelected(person)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4) }}
                  whileHover={{ y: -8 }}
                  className={`group flex flex-col items-center rounded-xl border border-white/60 bg-white p-5 text-center shadow-md transition hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 ${style.ring}`}
                >
                  <div className="relative">
                    <PersonPhoto
                      src={person.image_url}
                      alt={person.name}
                      boxClassName="h-24 w-24 rounded-xl transition group-hover:scale-105"
                      imageClassName="object-cover"
                    />
                    <span
                      className={`absolute -bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border text-white shadow-md ${style.badge}`}
                    >
                      <RoleIcon className="h-4 w-4" />
                    </span>
                  </div>

                  <span
                    className={`mt-4 inline-block rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${style.badge}`}
                  >
                    {t(style.labelKey)}
                  </span>
                  <h3 className="mt-2 text-sm font-extrabold leading-snug text-zinc-900 dark:text-white">
                    {person.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {person.position}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 opacity-0 transition group-hover:opacity-100 dark:text-emerald-400">
                    <Users className="h-3.5 w-3.5" />
                    {t("common.detail")}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        label={selected?.name ?? ""}
      >
        {selected && (
          <div className="p-6 sm:p-7">
            <div
              className="pattern-islamic absolute inset-x-0 top-0 h-28 opacity-10"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center text-center">
              <PersonPhoto
                src={selected.image_url}
                alt={selected.name}
                boxClassName="h-28 w-28 rounded-xl"
                imageClassName="object-cover ring-4 ring-emerald-500/40"
                width={112}
                height={112}
              />
              <span
                className={`mt-4 inline-block rounded-full border px-4 py-1 text-xs font-extrabold uppercase tracking-wide ${ROLE_STYLES[selected.role].badge}`}
              >
                {t(ROLE_STYLES[selected.role].labelKey)}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-zinc-900 dark:text-white">
                {selected.name}
              </h3>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {selected.position}
              </p>

              <div className="mt-4 w-full rounded-xl bg-emerald-50/80 p-4 text-start dark:bg-zinc-800/70">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {t("org.about")}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {selected.bio}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {selected.social_links.instagram && (
                  <a
                    href={selected.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-full border border-zinc-200 p-2.5 text-zinc-600 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {selected.social_links.whatsapp && (
                  <a
                    href={selected.social_links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="rounded-full border border-zinc-200 p-2.5 text-zinc-600 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <WhatsAppIcon />
                  </a>
                )}
                {selected.social_links.email && (
                  <a
                    href={`mailto:${selected.social_links.email}`}
                    aria-label="Email"
                    className="rounded-full border border-zinc-200 p-2.5 text-zinc-600 transition hover:border-emerald-500 hover:bg-emerald-500 hover:text-white dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <AtSign />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
