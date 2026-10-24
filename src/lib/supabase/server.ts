import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk Server Components, Server Actions, dan Route Handlers.
 *
 * Membaca sesi admin dari cookie lalu menulis ulang cookie saat token
 * refresh. Selalu buat client baru per-request (jangan di-share).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // `set` akan gagal kalau dipanggil dari Server Component (cookie
          // baca-saja). Refresh token ditangani oleh proxy.ts, jadi aman
          // ditelan di sini.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* abaikan — lihat catatan di atas */
          }
        },
      },
    },
  );
}
