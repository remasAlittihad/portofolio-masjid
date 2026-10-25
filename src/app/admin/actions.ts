"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PENGURUS_EXECUTIVES } from "@/lib/pengurus";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Hasil operasi admin — dikembalikan ke client untuk ditampilkan. */
export interface AdminResult {
  ok: boolean;
  message?: string;
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/** Pastikan admin sudah login, selain itu lempar ke halaman login. */
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function loginAction(
  _prevState: { message: string | null },
  formData: FormData,
): Promise<{ message: string | null }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: "Email atau kata sandi salah." };
  }

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Helper upload gambar ke Supabase Storage (bucket `media`)           */
/* ------------------------------------------------------------------ */

/** Ekstrak path internal dari URL publik Supabase Storage. */
function mediaPathFromUrl(url: string): string | null {
  const marker = "/object/public/media/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

async function uploadMedia(
  supabase: SupabaseClient,
  file: File,
  folder: string,
): Promise<string> {
  if (!file || file.size === 0) throw new Error("File gambar kosong.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, WEBP, GIF, atau AVIF.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  // Jangan gunakan Date.now() di Server Action: Next.js 16 dapat
  // mengevaluasinya saat prerendering route yang mengimpor action ini.
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

async function deleteMediaByUrl(supabase: SupabaseClient, url: string) {
  const path = mediaPathFromUrl(url);
  if (!path) return;
  await supabase.storage.from("media").remove([path]);
}

/* ------------------------------------------------------------------ */
/* Galeri                                                              */
/* ------------------------------------------------------------------ */

export async function saveGalleryItemAction(
  formData: FormData,
): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const id = (formData.get("id") as string | null)?.trim() || null;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "Lainnya";
  const date = String(formData.get("date") ?? "").trim();
  const existingUrl = String(formData.get("existing_url") ?? "").trim();
  const file = formData.get("image") as File | null;

  if (!title) return { ok: false, message: "Judul wajib diisi." };
  if (!date) return { ok: false, message: "Tanggal wajib diisi." };

  let image_url = existingUrl;
  try {
    if (file && file.size > 0) {
      image_url = await uploadMedia(supabase, file, "galeri");
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gagal mengunggah gambar." };
  }
  if (!image_url) return { ok: false, message: "Gambar wajib diunggah." };

  // For new items, use server current date; for edits, preserve original date
  const payloadDate = id ? date : new Date().toISOString().slice(0, 10);

  if (id) {
    const { error } = await supabase
      .from("gallery")
      .update({ title, category, date: payloadDate, image_url })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("gallery")
      .insert({ title, category, date: payloadDate, image_url });
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteGalleryItemAction(id: string): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const { data: row, error: fetchError } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .single();
  if (fetchError) return { ok: false, message: fetchError.message };

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (row?.image_url) await deleteMediaByUrl(supabase, row.image_url);

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Pengurus (executives)                                               */
/* ------------------------------------------------------------------ */

/** Impor nama pengurus awal dari `pengurus.ts` ke Supabase (sekali saja). */
export async function seedExecutivesAction(): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const { count } = await supabase
    .from("executives")
    .select("*", { count: "exact", head: true });
  if (count && count > 0) {
    return { ok: false, message: "Data pengurus sudah ada di Supabase." };
  }

  const rows = PENGURUS_EXECUTIVES.map(
    ({ name, role, position, image_url, bio, social_links }) => ({
      name,
      role,
      position,
      image_url,
      bio,
      social_links,
    }),
  );

  const { error } = await supabase.from("executives").insert(rows);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: `${rows.length} nama pengurus berhasil diimpor.` };
}

export async function saveExecutiveAction(
  formData: FormData,
): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const id = (formData.get("id") as string | null)?.trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const existingUrl = String(formData.get("existing_url") ?? "").trim();
  const file = formData.get("image") as File | null;

  if (!name) return { ok: false, message: "Nama wajib diisi." };
  if (!position) return { ok: false, message: "Jabatan wajib diisi." };
  if (!["Pembina", "Ketua", "BPH", "Anggota"].includes(role)) {
    return { ok: false, message: "Role tidak valid." };
  }

  let image_url = existingUrl;
  try {
    if (file && file.size > 0) {
      image_url = await uploadMedia(supabase, file, "pengurus");
    }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gagal mengunggah foto." };
  }

  const payload = { name, position, role, bio, image_url };

  if (id) {
    const { error } = await supabase
      .from("executives")
      .update(payload)
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { error } = await supabase.from("executives").insert(payload);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteExecutiveAction(id: string): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const { data: row, error: fetchError } = await supabase
    .from("executives")
    .select("image_url")
    .eq("id", id)
    .single();
  if (fetchError) return { ok: false, message: fetchError.message };

  const { error } = await supabase.from("executives").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (row?.image_url) await deleteMediaByUrl(supabase, row.image_url);

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Program kerja                                                       */
/* ------------------------------------------------------------------ */

export async function saveProgramAction(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const payload = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    status: String(formData.get("status") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
  };
  if (!payload.title || !payload.date || !payload.category || !payload.status) {
    return { ok: false, message: "Judul, kategori, tanggal, dan status wajib diisi." };
  }
  const query = id ? supabase.from("programs").update(payload).eq("id", id) : supabase.from("programs").insert(payload);
  const { error } = await query;
  if (error) return { ok: false, message: error.message };
  revalidatePath("/"); revalidatePath("/admin");
  return { ok: true };
}

export async function deleteProgramAction(id: string): Promise<AdminResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/"); revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Kas                                                                 */

export async function saveFinancialAction(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const payload = { title: String(formData.get("title") ?? "").trim(), amount: Number(formData.get("amount") ?? 0), type: String(formData.get("type") ?? ""), date: String(formData.get("date") ?? "") };
  if (!payload.title || payload.amount < 0 || !["income", "expense"].includes(payload.type) || !payload.date) return { ok: false, message: "Data transaksi belum lengkap." };
  const query = id ? supabase.from("financial_logs").update(payload).eq("id", id) : supabase.from("financial_logs").insert(payload);
  const { error } = await query;
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/kas"); revalidatePath("/");
  return { ok: true };
}

export async function deleteFinancialAction(id: string): Promise<AdminResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("financial_logs").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/kas"); revalidatePath("/");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Media (gambar bebas)                                                */
/* ------------------------------------------------------------------ */

export interface MediaEntry {
  folder: string;
  name: string;
  url: string;
  size?: number;
  createdAt?: string;
}

/** Daftar gambar di folder `galeri` dan `pengurus` pada bucket `media`. */
export async function listMediaAction(): Promise<MediaEntry[]> {
  const { supabase } = await requireUser();
  const folders = ["galeri", "pengurus"];
  const out: MediaEntry[] = [];

  for (const folder of folders) {
    const { data } = await supabase.storage.from("media").list(folder, {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });
    for (const item of data ?? []) {
      if (!item.id) continue; // lewati sub-folder
      const { data: pub } = supabase.storage
        .from("media")
        .getPublicUrl(`${folder}/${item.name}`);
      out.push({
        folder,
        name: item.name,
        url: pub.publicUrl,
        size: item.metadata?.size as number | undefined,
        createdAt: item.metadata?.created_at as string | undefined,
      });
    }
  }

  return out;
}

export async function uploadMediaAction(formData: FormData): Promise<AdminResult> {
  const { supabase } = await requireUser();

  const folder = String(formData.get("folder") ?? "galeri").trim() || "galeri";
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { ok: false, message: "Pilih gambar dulu." };

  try {
    await uploadMedia(supabase, file, folder);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gagal mengunggah." };
  }

  revalidatePath("/admin");
  return { ok: true, message: "Gambar berhasil diunggah." };
}

export async function deleteMediaAction(
  folder: string,
  name: string,
): Promise<AdminResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.storage.from("media").remove([`${folder}/${name}`]);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin");
  return { ok: true };
}
