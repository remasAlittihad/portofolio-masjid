import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proteksi halaman admin (Next.js 16 memakai `proxy.ts`, pengganti `middleware.ts`).
 *
 * - Belum login & bukan halaman login  → dialihkan ke /admin/login
 * - Sudah login & membuka /admin/login → dialihkan ke /admin
 * - Seluruh respons /admin diberi header X-Robots-Tag: noindex
 *   (mencegah mesin pencari mengindeks halaman admin)
 */
export async function proxy(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
        },
      },
    },
  );

  // `getUser()` memverifikasi token ke Supabase & menyegarkan sesi bila perlu.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLoginPath = path === "/admin/login";

  /** Buat respons lanjutan yang tetap membawa header noindex. */
  const withNoindex = (res: NextResponse) => {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  };

  if (!user && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return withNoindex(NextResponse.redirect(url));
  }

  if (user && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return withNoindex(NextResponse.redirect(url));
  }

  // Untuk permintaan yang lolos (mis. /admin/login tanpa sesi), lanjutkan
  // render seperti biasa — tetap dengan header noindex.
  return withNoindex(NextResponse.next({ request }));
}

export const config = {
  // Daftar eksplisit agar `/admin` (tanpa trailing slash) tetap tertangkap.
  matcher: ["/admin", "/admin/:path*"],
};
