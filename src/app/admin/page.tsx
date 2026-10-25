import { notFound } from "next/navigation";

/**
 * `/admin` bukan route dashboard yang dapat diakses langsung. Dashboard tetap
 * tersedia melalui route admin yang valid dan autentikasinya tidak berubah.
 */
export default function AdminPage(): never {
  notFound();
}
