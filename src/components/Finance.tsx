"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  Eye,
  Info,
  PiggyBank,
  Receipt,
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

  const recent = useMemo(
    () => (logs ? [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6) : []),
    [logs],
  );

  const incomePct =
    stats.income + stats.expense > 0
      ? Math.round((stats.income / (stats.income + stats.expense)) * 100)
      : 50;
  const expensePct = 100 - incomePct;

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
        <div className="grid gap-5 sm:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, accent, text, chip }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-6 shadow-md transition hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${accent}`} />
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${accent} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold dark:bg-zinc-800 ${text}`}
                  >
                    {chip}
                    {logs ? "IDR" : "…"}
                  </span>
                </div>
                <div className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 tabular-nums dark:text-white">
                  {logs ? rupiah(value) : "—"}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {label}
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chart */}
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-xl border border-zinc-200/80 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                <Eye className="h-4 w-4 text-emerald-600" />
                {t("finance.chartTitle")}
              </h3>

              {/* Animated bars */}
              <div className="mt-6 flex h-56 items-end gap-6">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {incomePct}%
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${Math.max(incomePct, 8)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="w-full rounded-t-2xl bg-linear-to-t from-emerald-700 to-emerald-500 shadow-lg shadow-emerald-600/25"
                  />
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    {t("finance.income")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                    {expensePct}%
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${Math.max(expensePct, 8)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                    className="w-full rounded-t-2xl bg-linear-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-600/25"
                  />
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    {t("finance.expense")}
                  </span>
                </div>
              </div>

              <p className="mt-5 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-zinc-600 dark:bg-zinc-800/70 dark:text-zinc-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {t("finance.note")}
              </p>
            </div>
          </Reveal>

          {/* Table */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="h-full overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <Receipt className="h-4 w-4 text-ir-gold" />
                  {t("finance.recentTitle")}
                </h3>
                <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  {logs?.length ?? 0} {t("finance.transactionCount")}
                </span>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="text-start text-xs font-bold uppercase tracking-wide text-zinc-400">
                      <th className="px-6 py-3 text-start">{t("finance.desc")}</th>
                      <th className="px-4 py-3 text-start">{t("common.date")}</th>
                      <th className="px-4 py-3 text-end">{t("common.category")}</th>
                      <th className="px-6 py-3 text-end">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!logs ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-zinc-400">
                          {t("common.loading")}
                        </td>
                      </tr>
                    ) : (
                      recent.map((log, i) => {
                        const isIncome = log.type === "income";
                        return (
                          <motion.tr
                            key={log.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="border-t border-zinc-100 transition hover:bg-emerald-50/60 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
                          >
                            <td className="px-6 py-3.5">
                              <span className="flex items-center gap-2.5">
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                    isIncome
                                      ? "bg-emerald-600/10 text-emerald-600"
                                      : "bg-rose-500/10 text-rose-500"
                                  }`}
                                >
                                  {isIncome ? (
                                    <TrendingUp className="h-4 w-4" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4" />
                                  )}
                                </span>
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                  {log.title}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-zinc-500 dark:text-zinc-400">
                              {new Date(log.date).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="px-4 py-3.5 text-end">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                  isIncome
                                    ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                    : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                                }`}
                              >
                                {isIncome ? t("finance.income") : t("finance.expense")}
                              </span>
                            </td>
                            <td
                              className={`px-6 py-3.5 text-end font-extrabold tabular-nums ${
                                isIncome
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {isIncome ? "+" : "−"}
                              {rupiah(log.amount)}
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
