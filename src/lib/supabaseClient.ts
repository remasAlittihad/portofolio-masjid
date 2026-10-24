import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client helper.
 *
 * Reads public environment variables and exposes a singleton client.
 * When the environment variables are NOT provided (e.g. local dev before
 * the project is connected), `supabase` is `null` and the app gracefully
 * falls back to the mock dataset in `src/lib/mockData.ts`.
 *
 * Required (optional) environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: false },
    })
  : null;

/** Other configurable public values with sensible fallbacks. */
export const APP_CONFIG = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285692666575",
  prayerCity: process.env.NEXT_PUBLIC_PRAYER_CITY ?? "Jakarta",
  prayerCountry: process.env.NEXT_PUBLIC_PRAYER_COUNTRY ?? "Indonesia",
  mapEmbedUrl:
    process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
    // Harus URL embed (`&output=embed`), BUKAN link share maps.app.goo.gl —
    // link share me-redirect ke halaman penuh Google Maps yang menolak di-iframe.
    // Koordinat Masjid Jami' Al-Ittihad, Bojonggede, Kab. Bogor.
    "https://www.google.com/maps?q=-6.5017296,106.7697196&output=embed",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "Masjid Al-Ittihad, Indonesia",
};
