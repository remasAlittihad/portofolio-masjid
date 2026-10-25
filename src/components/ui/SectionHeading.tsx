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
      <span className="editorial-label">{label}</span>
      <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-ir-green-dark dark:text-white sm:text-5xl">
        {title}
      </h2>
      <div className="h-px w-16 bg-ir-gold" />
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
