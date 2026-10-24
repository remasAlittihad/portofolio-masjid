import { supabase } from "./supabaseClient";
import type { TableName } from "./types";

/**
 * Generic data fetcher with mock fallback.
 *
 * Tries Supabase first; when the client is not configured, the query fails,
 * or the table returns no rows, it returns the bundled mock dataset so the
 * portfolio stays fully functional without a backend.
 */
export async function fetchTable<T>(
  table: TableName,
  fallback: T[],
): Promise<T[]> {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase.from(table).select("*");
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

/** Runs a fetch and resolves to `fallback` if anything goes wrong. */
export async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
