/**
 * IRMA Al-Ittihad — shared domain types.
 * Mirrors the Supabase schema in `supabase/schema.sql`.
 */

export type ExecutiveRole = "Pembina" | "Ketua" | "BPH" | "Anggota";

export type ProgramCategory = "Keagamaan" | "Sosial" | "Pelatihan" | "Olahraga";

export type ProgramStatus = "Akan Datang" | "Berlangsung" | "Selesai";

export type FinancialType = "income" | "expense";

export type QuoteSource = "Hadith" | "Ayat";

export interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  email?: string;
}

export interface Executive {
  id: string;
  name: string;
  role: ExecutiveRole;
  /** Jabatan detail, mis. "Ketua Umum", "Sekretaris I" */
  position: string;
  image_url: string;
  bio: string;
  social_links: SocialLinks;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: ProgramCategory;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  status: ProgramStatus;
  location: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
}

export interface Member {
  id: string;
  name: string;
  age: number;
  phone: string;
  motivation: string;
  created_at: string;
}

export interface FinancialLog {
  id: string;
  title: string;
  amount: number;
  type: FinancialType;
  /** ISO date (YYYY-MM-DD) */
  date: string;
}

export interface Quote {
  id: string;
  text: string;
  source: QuoteSource;
  /** Teks Arab (opsional) untuk tampilan Ayat/Hadist */
  arabic?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  /** ISO date-time */
  date: string;
  description: string;
}

export type TableName =
  | "executives"
  | "programs"
  | "gallery"
  | "financial_logs"
  | "quotes";

export type Language = "id" | "ar" | "en";
