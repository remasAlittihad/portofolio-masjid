"use client";

import { useEffect, useState } from "react";

/**
 * Returns the current epoch time (ms) refreshed on an interval.
 * The first value is delivered asynchronously (0ms timeout) so effects never
 * call `setState` synchronously — keeping the new React hooks lint rules happy
 * and avoiding cascading renders on mount.
 * Returns `null` until the first client tick (keeps SSR output deterministic).
 */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(initial);
    };
  }, [intervalMs]);

  return now;
}
