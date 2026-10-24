import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { listMediaAction, type MediaEntry } from "./actions";
import type { Executive, GalleryItem, Program } from "@/lib/types";
import {
  defaultExecutives,
  defaultGallery,
  defaultPrograms,
} from "@/lib/admin-defaults";

/**
 * Dashboard admin.
 *
 * Dibungkus `<Suspense>` karena memanggil `cookies()` (sesi Supabase).
 * Dengan `cacheComponents: true`, bagian dinamis di-stream saat request
 * sehingga build tetap bisa membuat shell statis. `proxy.ts` sudah
 * memastikan hanya user login yang sampai ke sini.
 */
export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboardLoader />
    </Suspense>
  );
}

/**
 * Loader dinamis — dieksekusi saat request user masuk, bukan saat build.
 * Pembacaan cookie sesi berlangsung di dalam Suspense boundary di atas.
 */
async function AdminDashboardLoader() {
  // Halaman admin selalu bergantung pada sesi dan data request saat ini.
  // Tandai bagian ini sebagai request-time agar tidak diprerender.
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [galleryRes, executivesRes, programsRes] = await Promise.all([
    supabase.from("gallery").select("*").order("date", { ascending: false }),
    supabase.from("executives").select("*"),
    supabase.from("programs").select("*").order("date", { ascending: false }),
  ]);

  const media: MediaEntry[] = await listMediaAction().catch(() => []);

  return (
    <AdminDashboard
      email={user.email ?? "admin"}
      initialGallery={galleryRes.data?.length ? (galleryRes.data as GalleryItem[]) : defaultGallery}
      initialExecutives={
        executivesRes.data?.length
          ? (executivesRes.data as Executive[])
          : defaultExecutives
      }
      initialPrograms={programsRes.data?.length ? (programsRes.data as Program[]) : defaultPrograms}
      programsError={programsRes.error?.message ?? null}
      initialMedia={media}
      galleryError={galleryRes.error?.message ?? null}
      executivesError={executivesRes.error?.message ?? null}
    />
  );
}

function AdminLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-4/3 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}
