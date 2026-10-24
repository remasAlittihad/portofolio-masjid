import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Program } from "./types";

/**
 * Exports the official Program Work Plan (Rencana Program Kerja)
 * as a downloadable PDF document using jsPDF + autotable.
 */
export function exportProgramsPdf(programs: Program[]): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header band ---
  doc.setFillColor(5, 150, 105); // #059669
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setFillColor(217, 119, 6); // #D97706
  doc.rect(0, 92, pageWidth, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("IRMA Al-Ittihad", 40, 44);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Ikatan Remaja Masjid Al-Ittihad", 40, 64);
  doc.text("Bukan Sekedar Muda, Tapi Juga Bermakna", 40, 80);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.text("Rencana Program Kerja", 40, 132);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const generatedAt = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Dicetak pada: ${generatedAt}`, 40, 150);

  // --- Summary chips ---
  const total = programs.length;
  const upcoming = programs.filter((p) => p.status === "Akan Datang").length;
  const ongoing = programs.filter((p) => p.status === "Berlangsung").length;
  const done = programs.filter((p) => p.status === "Selesai").length;
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text(
    `Total Program: ${total}   |   Akan Datang: ${upcoming}   |   Berlangsung: ${ongoing}   |   Selesai: ${done}`,
    40,
    172,
  );

  // --- Table ---
  const body = programs.map((p, i) => [
    String(i + 1),
    p.title,
    p.category,
    formatDate(p.date),
    p.location,
    p.status,
  ]);

  autoTable(doc, {
    startY: 188,
    head: [["No", "Program", "Kategori", "Tanggal", "Lokasi", "Status"]],
    body,
    theme: "striped",
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    styles: { fontSize: 9, cellPadding: 6, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 130 },
      4: { cellWidth: 110 },
    },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pages = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `IRMA Al-Ittihad — Program Kerja | Halaman ${pages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 24,
        { align: "center" },
      );
    },
  });

  doc.save("program-kerja-irma-al-ittihad.pdf");
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
