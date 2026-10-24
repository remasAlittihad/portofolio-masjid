"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { Logo } from "@/components/ui/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      {pending ? "Memeriksa…" : "Masuk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { message: null });

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/10 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-8 ring-emerald-50/70 dark:bg-emerald-500/10 dark:ring-emerald-500/5">
          <Logo className="h-11 w-11" />
        </div>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600">IRMA Al-Ittihad</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Masuk Admin</h1>
        <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Kelola data kegiatan, galeri, dan pengurus masjid dengan aman.
        </p>

        <form action={formAction} className="mt-7 w-full space-y-5">
          <div className="text-start">
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-zinc-600 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </div>

          <div className="text-start">
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-zinc-600 dark:text-zinc-300"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900"
            />
          </div>

          {state.message && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {state.message}
            </p>
          )}

          <SubmitButton />
        </form>

      </div>
    </div>
  );
}
