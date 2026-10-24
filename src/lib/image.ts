/**
 * Helpers for `<Image src>` — data dari Supabase bisa berupa string kosong
 * (kolom `image_url text not null default ''`) sehingga Next.js melempar
 * `TypeError: Failed to construct 'URL': Invalid URL`.
 */

/** Return `url` bila valid, selain itu `fallback`. */
export function imageSrc(
  url: string | null | undefined,
  fallback: string,
): string {
  const value = url?.trim();
  if (value && /^(https?:\/\/|\/)/i.test(value)) return value;
  return fallback;
}

/** Deterministic hash → index avatar (1..70), stabil antar render. */
function hashIndex(seed: string, max = 70): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % max) + 1;
}

/** Avatar placeholder dari nama (atau id) — selalu menghasilkan URL valid. */
export function avatarUrl(seed: string): string {
  return `https://i.pravatar.cc/300?img=${hashIndex(seed || "irma")}`;
}

/** Foto placeholder galeri dari id item. */
export function galleryFallback(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || "irma")}/900/700`;
}
