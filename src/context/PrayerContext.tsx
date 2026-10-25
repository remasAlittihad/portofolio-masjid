"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchPrayerSchedule,
  formatCountdown,
  getNextPrayer,
  resolvePrayerCity,
  type NextPrayer,
  type PrayerSchedule,
} from "@/lib/prayer";

interface PrayerContextValue {
  schedule: PrayerSchedule | null;
  city: string;
  next: NextPrayer | null;
  countdown: string;
  /** milliseconds remaining until the next prayer */
  remainingMs: number;
}

const PrayerContext = createContext<PrayerContextValue | null>(null);

/**
 * Fetches today's prayer times once (Aladhan API, city auto-detected from
 * the browser timezone) and ticks a countdown to the next prayer every second.
 */
export function PrayerProvider({ children }: { children: ReactNode }) {
  const { city, country } = useMemo(() => resolvePrayerCity(), []);
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPrayerSchedule(city, country).then((s) => {
      if (!cancelled) setSchedule(s);
    });
    return () => {
      cancelled = true;
    };
  }, [city, country]);

  // Start the ticker only on the client. Do not spend a timer tick while the
  // tab is hidden: this avoids needless React renders when the page is in the
  // background (especially noticeable on mobile browsers).
  useEffect(() => {
    let id: number | undefined;
    const tick = () => setNow(new Date());
    const start = () => {
      if (document.visibilityState === "visible" && id === undefined) {
        tick();
        id = window.setInterval(tick, 1000);
      }
    };
    const stop = () => {
      if (id !== undefined) {
        window.clearInterval(id);
        id = undefined;
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const next =
    schedule && now ? getNextPrayer(schedule.timings, now) : null;
  const remainingMs = next && now ? Math.max(0, next.at.getTime() - now.getTime()) : 0;

  return (
    <PrayerContext.Provider
      value={{
        schedule,
        city,
        next,
        remainingMs,
        countdown: formatCountdown(remainingMs),
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayer(): PrayerContextValue {
  const ctx = useContext(PrayerContext);
  if (!ctx) throw new Error("usePrayer must be used within <PrayerProvider>");
  return ctx;
}
