"use client";

import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
}

/** Consistent eyebrow + heading + subtitle used by every section. */
export function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={`flex flex-col gap-3 ${centered ? "items-center text-center" : "items-start"}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-ir-gold" />
        {label}
      </span>
      <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <div className="gold-rule h-0.5 w-24 rounded-full" />
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
