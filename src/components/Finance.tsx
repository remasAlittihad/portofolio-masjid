"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { fetchTable } from "@/lib/data";
import { MOCK_FINANCIAL_LOGS } from "@/lib/mockData";
import type { FinancialLog } from "@/lib/types";

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export function Finance() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<FinancialLog[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTable<FinancialLog>("financial_logs", MOCK_FINANCIAL_LOGS).then((rows) => {
      if (!cancelled) setLogs(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!logs) return { income: 0, expense: 0, balance: 0 };
    const income = logs
      .filter((l) => l.type === "income")
      .reduce((sum, l) => sum + l.amount, 0);
    const expense = logs
      .filter((l) => l.type === "expense")
      .reduce((sum, l) => sum + l.amount, 0);
    return { income, expense, balance: income - expense };
  }, [logs]);

  const cards = [
    {
      label: t("finance.totalIncome"),
      value: stats.income,
      icon: TrendingUp,
      accent: "from-emerald-600 to-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      chip: <ArrowUpRight className="h-4 w-4" />,
    },
    {
      label: t("finance.totalExpense"),
      value: stats.expense,
      icon: TrendingDown,
      accent: "from-rose-500 to-rose-400",
      text: "text-rose-600 dark:text-rose-400",
      chip: <ArrowDownRight className="h-4 w-4" />,
    },
    {
      label: t("finance.balance"),
      value: stats.balance,
      icon: PiggyBank,
      accent: "from-ir-gold to-ir-gold-light",
      text: "text-ir-gold",
      chip: <BadgeDollarSign className="h-4 w-4" />,
    },
  ];

  return (
    <section id="kas" className="relative py-20 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4">
        <SectionHeading
          label={t("finance.label")}
          title={t("finance.title")}
          subtitle={t("finance.subtitle")}
        />

        {/* Summary cards */}
        <div className="grid min-w-0 gap-5 sm:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, accent, text, chip }, i) => (
            <Reveal key={label} delay={i * 0.08} className="w-full min-w-0 max-w-full">
              <motion.article
                whileHover={{ y: -8 }}
                className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-4 shadow-md transition hover:shadow-2xl sm:p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${accent}`} />
                <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${accent} text-white shadow-lg sm:h-12 sm:w-12`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span
                    className={`inline-flex min-w-0 max-w-[55%] items-center gap-1 overflow-hidden rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold dark:bg-zinc-800 ${text}`}
                  >
                    {chip}
                    <span className="truncate">{logs ? "IDR" : "…"}</span>
                  </span>
                </div>
                <div className="mt-4 break-words text-lg font-extrabold leading-tight tracking-tight text-zinc-900 tabular-nums sm:text-2xl dark:text-white">
                  {logs ? rupiah(value) : "—"}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {label}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
