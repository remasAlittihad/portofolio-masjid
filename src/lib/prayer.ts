import { APP_CONFIG } from "./supabaseClient";
import { safeFetch } from "./data";

/**
 * Prayer times helper — Aladhan API with an offline fallback schedule.
 */

export const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isya"] as const;

export type PrayerKey = (typeof PRAYER_KEYS)[number];

const PRAYER_LABEL_KEYS: Record<PrayerKey, string> = {
  fajr: "schedule.subuh",
  dhuhr: "schedule.dzuhur",
  asr: "schedule.ashar",
  maghrib: "schedule.maghrib",
  isya: "schedule.isya",
};

export interface PrayerTimings {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isya: string;
}

export interface PrayerSchedule {
  timings: PrayerTimings;
  /** false → offline fallback schedule is being used */
  live: boolean;
}

/** Approximate schedule used when the API is unreachable. */
const FALLBACK_TIMINGS: PrayerTimings = {
  fajr: "04:35",
  dhuhr: "11:58",
  asr: "15:19",
  maghrib: "17:55",
  isya: "19:05",
};

/** Kemenag RI calculation method. */
const METHOD_ID = 20;

function cleanTime(raw: string): string {
  // Aladhan returns e.g. "04:35 (WIB)" — keep only HH:MM
  return raw.trim().slice(0, 5);
}

interface AladhanResponse {
  code: number;
  status: string;
  data?: {
    timings?: Record<string, string>;
  };
}

export async function fetchPrayerSchedule(
  city: string = APP_CONFIG.prayerCity,
  country: string = APP_CONFIG.prayerCountry,
): Promise<PrayerSchedule> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const url = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${METHOD_ID}`;

  const res = await safeFetch<AladhanResponse>(url, { code: 0, status: "error" });

  const t = res.data?.timings;
  if (res.code === 200 && t) {
    return {
      live: true,
      timings: {
        fajr: cleanTime(t.Fajr ?? FALLBACK_TIMINGS.fajr),
        dhuhr: cleanTime(t.Dhuhr ?? FALLBACK_TIMINGS.dhuhr),
        asr: cleanTime(t.Asr ?? FALLBACK_TIMINGS.asr),
        maghrib: cleanTime(t.Maghrib ?? FALLBACK_TIMINGS.maghrib),
        isya: cleanTime(t.Isha ?? FALLBACK_TIMINGS.isya),
      },
    };
  }
  return { live: false, timings: FALLBACK_TIMINGS };
}

/**
 * Picks an Indonesian city based on the browser timezone,
 * unless NEXT_PUBLIC_PRAYER_CITY is explicitly provided.
 */
export function resolvePrayerCity(): { city: string; country: string } {
  const fromEnv = process.env.NEXT_PUBLIC_PRAYER_CITY;
  if (fromEnv) return { city: fromEnv, country: APP_CONFIG.prayerCountry };

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Jakarta") return { city: "Jakarta", country: "Indonesia" };
    if (tz === "Asia/Makassar") return { city: "Makassar", country: "Indonesia" };
    if (tz === "Asia/Jayapura") return { city: "Jayapura", country: "Indonesia" };
  } catch {
    /* noop */
  }
  return { city: APP_CONFIG.prayerCity, country: APP_CONFIG.prayerCountry };
}

/** "HH:MM" → Date (today in local time) */
function timeToDate(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map((v) => parseInt(v, 10));
  const d = new Date(base);
  d.setHours(Number.isNaN(h) ? 0 : h, Number.isNaN(m) ? 0 : m, 0, 0);
  return d;
}

export interface NextPrayer {
  key: PrayerKey;
  labelKey: string;
  time: string;
  at: Date;
}

/** Returns the next upcoming prayer for the given schedule. */
export function getNextPrayer(
  timings: PrayerTimings,
  now: Date = new Date(),
): NextPrayer {
  const entries = PRAYER_KEYS.map((key) => ({
    key,
    labelKey: PRAYER_LABEL_KEYS[key],
    time: timings[key],
    at: timeToDate(now, timings[key]),
  }));

  const upcoming = entries.find((e) => e.at.getTime() > now.getTime());
  if (upcoming) return upcoming;

  // All prayers have passed → tomorrow's Fajr
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const next = timeToDate(tomorrow, timings.fajr);
  return { key: "fajr", labelKey: PRAYER_LABEL_KEYS.fajr, time: timings.fajr, at: next };
}

/** Formats a millisecond duration as a padded HH:MM:SS countdown. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(hours + days * 24);
  return `${hh}:${pad(minutes)}:${pad(seconds)}`;
}
