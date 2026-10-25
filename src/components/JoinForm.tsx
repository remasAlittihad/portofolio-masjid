"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { APP_CONFIG, supabase } from "@/lib/supabaseClient";

export interface JoinFormData {
  name: string;
  age: string;
  phone: string;
  motivation: string;
}

const EMPTY: JoinFormData = { name: "", age: "", phone: "", motivation: "" };

interface JoinFormProps {
  /** Fired after the WhatsApp tab has been opened (e.g. to close a modal) */
  onSubmitted?: () => void;
  idPrefix?: string;
  compact?: boolean;
}

/**
 * Interactive WhatsApp registration form.
 * Validates the fields and opens a pre-formatted WhatsApp chat with the admin.
 */
export function JoinForm({ onSubmitted, idPrefix = "join", compact }: JoinFormProps) {
  const { t } = useLanguage();
  const [form, setForm] = useState<JoinFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof JoinFormData, string>>>({});

  const set = (field: keyof JoinFormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = t("form.errName");
    if (!form.age.trim() || Number(form.age) <= 0) next.age = t("form.errAge");
    if (form.phone.replace(/\D/g, "").length < 9) next.phone = t("form.errPhone");
    if (!form.motivation.trim()) next.motivation = t("form.errMotivation");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = [
      "Assalamualaikum warahmatullahi wabarakatuh 🌙",
      "",
      "*PENDAFTARAN ANGGOTA IRMA AL-ITTIHAD*",
      "Bukan Sekedar Muda, Tapi Juga Bermakna",
      "",
      `👤 Nama: ${form.name.trim()}`,
      `🗓 Usia: ${form.age.trim()} tahun`,
      `📱 No. WhatsApp: ${form.phone.trim()}`,
      `💡 Motivasi:`,
      form.motivation.trim(),
      "",
      "Saya ingin bergabung dan berkontribusi bersama IRMA Al-Ittihad.",
    ].join("\n");

    if (supabase) {
      const { error } = await supabase.from("members").insert({
        name: form.name.trim(),
        age: Number(form.age),
        phone: form.phone.trim(),
        motivation: form.motivation.trim(),
      });

      if (error) {
        // Database persistence is best-effort; the primary action is opening WhatsApp.
        // Do not block the user when Supabase is unavailable or the table is not configured.
        console.error("Gagal menyimpan data pendaftar ke Supabase:", error);
      }
    }

    const url = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setForm(EMPTY);
    onSubmitted?.();
  };

  const fieldClass = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 ${
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-300"
        : "border-zinc-200 focus:border-emerald-500 focus:ring-emerald-300 dark:border-zinc-700"
    }`;

  const inputId = (field: string) => `${idPrefix}-${field}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId("name")} className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("form.name")}
          </label>
          <input
            id={inputId("name")}
            type="text"
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            placeholder="Muhammad ..."
            className={fieldClass(errors.name)}
          />
          {errors.name && <FieldError message={errors.name} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={inputId("age")} className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {t("form.age")}
          </label>
          <input
            id={inputId("age")}
            type="number"
            min={1}
            max={99}
            value={form.age}
            onChange={(e) => set("age")(e.target.value)}
            placeholder="17"
            className={fieldClass(errors.age)}
          />
          {errors.age && <FieldError message={errors.age} />}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId("phone")} className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {t("form.phone")}
        </label>
        <input
          id={inputId("phone")}
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => set("phone")(e.target.value)}
          placeholder="0812xxxxxxx"
          className={fieldClass(errors.phone)}
          dir="ltr"
        />
        {errors.phone && <FieldError message={errors.phone} />}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId("motivation")} className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {t("form.motivation")}
        </label>
        <textarea
          id={inputId("motivation")}
          rows={compact ? 3 : 4}
          value={form.motivation}
          onChange={(e) => set("motivation")(e.target.value)}
          placeholder="..."
          className={`${fieldClass(errors.motivation)} resize-none`}
        />
        {errors.motivation && <FieldError message={errors.motivation} />}
      </div>

      <button
        type="submit"
        className="group flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl"
      >
        <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
        {t("form.submit")}
        <Send className="h-4 w-4 flip-x transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-rose-500">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </span>
  );
}
