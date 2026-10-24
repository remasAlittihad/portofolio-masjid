"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { imageSrc } from "@/lib/image";

type PersonPhotoProps = {
  /** Path foto ("" bila belum ada) — ambil dari `Executive.image_url`. */
  src: string | null | undefined;
  alt: string;
  /** Class ukuran/bulatan, mis. "h-24 w-24 rounded-xl" — dipakai juga utk ikon. */
  boxClassName: string;
  /** Class tambahan khusus elemen <Image>. */
  imageClassName?: string;
  width?: number;
  height?: number;
};

/**
 * Foto pengurus. Bila `src` kosong atau file-nya tidak ada (404),
 * menampilkan ikon orang sebagai pengganti — bukan foto placeholder acak.
 */
export function PersonPhoto({
  src,
  alt,
  boxClassName,
  imageClassName,
  width = 96,
  height = 96,
}: PersonPhotoProps) {
  const [broken, setBroken] = useState(false);
  const valid = !broken && imageSrc(src, "");

  if (!valid) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`${boxClassName} flex items-center justify-center bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-500 ring-1 ring-emerald-500/30 dark:from-emerald-500/15 dark:to-zinc-800 dark:text-emerald-400`}
      >
        <UserRound className="h-1/2 w-1/2" strokeWidth={1.5} aria-hidden="true" />
      </span>
    );
  }

  return (
    <Image
      src={valid}
      alt={alt}
      width={width}
      height={height}
      className={`${boxClassName} ${imageClassName ?? ""}`}
      onError={() => setBroken(true)}
    />
  );
}
