/**
 * Client-Side PDF Certificate Generator
 * Generates a 2-page landscape A4 PDF completion certificate & 30-day progress transcript
 * using jsPDF (100% client-side, sandbox/iFrame safe, zero window.open).
 */

import { jsPDF } from 'jspdf';
import { CertificateSummary } from './certificateData';

export type CertificatePdfTheme = 'ivory' | 'midnight';

export interface PdfExportOptions {
  theme: CertificatePdfTheme;
  includeTranscript: boolean;
}

interface Palette {
  bg: [number, number, number];
  card: [number, number, number];
  borderOuter: [number, number, number];
  borderInner: [number, number, number];
  textMain: [number, number, number];
  textMuted: [number, number, number];
  accent: [number, number, number];
  success: [number, number, number];
  rule: [number, number, number];
}

const PALETTES: Record<CertificatePdfTheme, Palette> = {
  ivory: {
    bg: [252, 250, 244],
    card: [255, 255, 255],
    borderOuter: [15, 23, 42],
    borderInner: [180, 134, 44],
    textMain: [15, 23, 42],
    textMuted: [71, 85, 105],
    accent: [2, 132, 199],
    success: [5, 150, 105],
    rule: [203, 213, 225],
  },
  midnight: {
    bg: [9, 13, 22],
    card: [17, 24, 39],
    borderOuter: [56, 189, 248],
    borderInner: [212, 168, 83],
    textMain: [248, 250, 252],
    textMuted: [148, 163, 184],
    accent: [56, 189, 248],
    success: [52, 211, 153],
    rule: [51, 65, 85],
  },
};

function sanitizeFilenameSegment(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'learner'
  );
}

export function createCertificatePdfDocument(
  summary: CertificateSummary,
  options: PdfExportOptions = { theme: 'ivory', includeTranscript: true }
): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 841.89
  const pageHeight = doc.internal.pageSize.getHeight(); // 595.28
  const palette = PALETTES[options.theme];

  // ============================================================================
  // PAGE 1: PERSONALIZED COMPLETION CERTIFICATE
  // ============================================================================
  doc.setFillColor(...palette.bg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer frame
  doc.setDrawColor(...palette.borderOuter);
  doc.setLineWidth(2.5);
  doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

  // Inner brass/gold hairline frame
  doc.setDrawColor(...palette.borderInner);
  doc.setLineWidth(1);
  doc.rect(34, 34, pageWidth - 68, pageHeight - 68);

  // Corner architectural accents
  const corners: [number, number, number, number][] = [
    [34, 34, 1, 1],
    [pageWidth - 34, 34, -1, 1],
    [34, pageHeight - 34, 1, -1],
    [pageWidth - 34, pageHeight - 34, -1, -1],
  ];
  doc.setDrawColor(...palette.borderInner);
  doc.setLineWidth(2);
  corners.forEach(([cx, cy, dx, dy]) => {
    doc.line(cx, cy, cx + 18 * dx, cy);
    doc.line(cx, cy, cx, cy + 18 * dy);
  });

  const centerX = pageWidth / 2;

  // Emblem & Program Kicker
  doc.setFillColor(...palette.accent);
  doc.roundedRect(centerX - 24, 58, 48, 30, 5, 5, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...(options.theme === 'ivory' ? ([255, 255, 255] as [number, number, number]) : ([9, 13, 22] as [number, number, number])));
  doc.text('Py', centerX, 78, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...palette.accent);
  doc.text('PYTHON VISUAL LAB  ·  30 DAYS OF VISUAL MASTERY', centerX, 110, { align: 'center' });

  // Main Certificate Heading
  doc.setFont('times', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(...palette.textMain);
  const certificateHeading = summary.isFullCompletion
    ? 'Certificate of Completion'
    : 'Certificate of Progress & Achievement';
  doc.text(certificateHeading, centerX, 152, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(...palette.textMuted);
  doc.text('THIS CREDENTIAL CERTIFIES THAT', centerX, 184, { align: 'center' });

  // Personalized Learner Name
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(36);
  doc.setTextColor(...palette.textMain);
  const displayName = summary.recipientName.slice(0, 48);
  doc.text(displayName, centerX, 232, { align: 'center' });

  // Name underline
  doc.setDrawColor(...palette.borderInner);
  doc.setLineWidth(1.2);
  doc.line(centerX - 180, 246, centerX + 180, 246);

  // Recognition Paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...palette.textMuted);
  const statementLine1 = summary.isFullCompletion
    ? 'has successfully completed all 30 days of interactive Python Visual Lab instruction,'
    : `has completed ${summary.daysCompleted} of ${summary.daysTotal} days (${summary.overallCompletionPercentage}% curriculum mastery) in Python Visual Lab,`;
  const statementLine2 = `focusing on ${summary.trackFocus} across Python foundations, OOP, NumPy/Pandas, Flask, MongoDB, and REST APIs.`;
  doc.text(statementLine1, centerX, 276, { align: 'center' });
  doc.text(statementLine2, centerX, 295, { align: 'center' });

  // 4 Metric Summary Cards
  const cardWidth = 165;
  const cardGap = 16;
  const totalRowWidth = cardWidth * 4 + cardGap * 3;
  const startX = centerX - totalRowWidth / 2;
  const cardY = 330;
  const cardH = 74;

  const kpis = [
    {
      label: 'DAYS COMPLETED',
      value: `${summary.daysCompleted} / ${summary.daysTotal}`,
      sub: `${summary.overallCompletionPercentage}% curriculum complete`,
    },
    {
      label: 'SUBTOPICS MASTERED',
      value: `${summary.subtopicsCompleted} / ${summary.subtopicsTotal}`,
      sub: 'Hands-on visual modules',
    },
    {
      label: 'EXERCISES SOLVED',
      value: `${summary.exercisesCompleted} / ${summary.exercisesTotal}`,
      sub:
        summary.averageExerciseScore !== null
          ? `Avg score: ${summary.averageExerciseScore} pts`
          : '4-tier practice system',
    },
    {
      label: 'QUIZZES & STREAK',
      value:
        summary.averageQuizScore !== null
          ? `${summary.averageQuizScore}% avg`
          : `${summary.quizzesPassed} / ${summary.daysTotal} passed`,
      sub: `${summary.streakDays}-day learning streak`,
    },
  ];

  kpis.forEach((kpi, index) => {
    const x = startX + index * (cardWidth + cardGap);
    doc.setFillColor(...palette.card);
    doc.setDrawColor(...palette.rule);
    doc.setLineWidth(0.9);
    doc.roundedRect(x, cardY, cardWidth, cardH, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(...palette.textMuted);
    doc.text(kpi.label, x + cardWidth / 2, cardY + 20, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...palette.textMain);
    doc.text(kpi.value, x + cardWidth / 2, cardY + 44, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...palette.accent);
    doc.text(kpi.sub, x + cardWidth / 2, cardY + 61, { align: 'center' });
  });

  // Certificate Footer Signatures & Verification
  const footerY = 486;
  doc.setDrawColor(...palette.rule);
  doc.setLineWidth(0.9);
  doc.line(78, footerY, 268, footerY);
  doc.line(centerX - 95, footerY, centerX + 95, footerY);
  doc.line(pageWidth - 268, footerY, pageWidth - 78, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...palette.textMain);
  doc.text(summary.issuedDateFormatted, 173, footerY - 8, { align: 'center' });
  doc.text('Python Visual Lab Curriculum', centerX, footerY - 8, { align: 'center' });
  doc.text(summary.certificateId, pageWidth - 173, footerY - 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...palette.textMuted);
  doc.text('DATE ISSUED', 173, footerY + 14, { align: 'center' });
  doc.text('PROGRAM AUTHORITY', centerX, footerY + 14, { align: 'center' });
  doc.text('CREDENTIAL VERIFICATION ID', pageWidth - 173, footerY + 14, { align: 'center' });

  doc.setFontSize(8);
  doc.text(
    'Generated locally in Python Visual Lab · Covers Foundations (Days 1–8), Core Engineering (Days 9–20), and Applied Systems (Days 21–30).',
    centerX,
    pageHeight - 48,
    { align: 'center' }
  );

  // ============================================================================
  // PAGE 2: 30-DAY DETAILED PROGRESS TRANSCRIPT
  // ============================================================================
  if (options.includeTranscript) {
    doc.addPage('a4', 'landscape');
    doc.setFillColor(...palette.bg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setDrawColor(...palette.borderOuter);
    doc.setLineWidth(1.5);
    doc.rect(24, 24, pageWidth - 48, pageHeight - 48);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...palette.textMain);
    doc.text('30-Day Progress Summary & Curriculum Transcript', 44, 56);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...palette.textMuted);
    doc.text(
      `Learner: ${displayName}  ·  Track: ${summary.trackFocus}  ·  ID: ${summary.certificateId}  ·  Issued: ${summary.issuedDateFormatted}`,
      44,
      73
    );

    // Level Summary Row (3 cards)
    const lvlWidth = (pageWidth - 88 - 24) / 3;
    const lvlY = 90;
    const lvlH = 58;
    summary.levelBreakdown.forEach((lvl, i) => {
      const lx = 44 + i * (lvlWidth + 12);
      doc.setFillColor(...palette.card);
      doc.setDrawColor(...palette.rule);
      doc.setLineWidth(0.8);
      doc.roundedRect(lx, lvlY, lvlWidth, lvlH, 5, 5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...palette.textMain);
      doc.text(`${lvl.label} (${lvl.dayRange})`, lx + 12, lvlY + 19);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...palette.textMuted);
      const quizTxt =
        lvl.averageQuizScore !== null ? `Quiz avg ${lvl.averageQuizScore}%` : `${lvl.quizzesPassed} quizzes passed`;
      doc.text(
        `Days: ${lvl.daysCompleted}/${lvl.daysTotal}  ·  Topics: ${lvl.subtopicsCompleted}/${lvl.subtopicsTotal}`,
        lx + 12,
        lvlY + 35
      );
      doc.text(
        `Exercises: ${lvl.exercisesCompleted}/${lvl.exercisesTotal}  ·  ${quizTxt}`,
        lx + 12,
        lvlY + 48
      );
    });

    // Two-column 30-day table (Days 1-15 Left, Days 16-30 Right)
    const tableTop = 166;
    const colGap = 18;
    const colWidth = (pageWidth - 88 - colGap) / 2;
    const rowHeight = 23.5;

    const renderHalfTable = (rows: CertificateSummary['days'], startTableX: number) => {
      // Table header bar
      doc.setFillColor(...palette.card);
      doc.setDrawColor(...palette.rule);
      doc.setLineWidth(0.8);
      doc.rect(startTableX, tableTop, colWidth, 22, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...palette.textMuted);
      doc.text('DAY', startTableX + 8, tableTop + 14);
      doc.text('CURRICULUM MODULE', startTableX + 38, tableTop + 14);
      doc.text('TOPICS', startTableX + colWidth - 134, tableTop + 14, { align: 'right' });
      doc.text('QUIZ', startTableX + colWidth - 88, tableTop + 14, { align: 'right' });
      doc.text('STATUS', startTableX + colWidth - 8, tableTop + 14, { align: 'right' });

      rows.forEach((row, idx) => {
        const y = tableTop + 22 + idx * rowHeight;
        if (idx % 2 === 1) {
          doc.setFillColor(...palette.card);
          doc.rect(startTableX, y, colWidth, rowHeight, 'F');
        }
        doc.setDrawColor(...palette.rule);
        doc.setLineWidth(0.4);
        doc.line(startTableX, y + rowHeight, startTableX + colWidth, y + rowHeight);

        const textBaseline = y + 15.5;
        doc.setFont('courier', 'bold');
        doc.setFontSize(8.2);
        doc.setTextColor(...palette.accent);
        doc.text(`D${row.day.toString().padStart(2, '0')}`, startTableX + 8, textBaseline);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.2);
        doc.setTextColor(...palette.textMain);
        const clippedTitle = row.title.length > 32 ? `${row.title.slice(0, 30)}…` : row.title;
        doc.text(clippedTitle, startTableX + 38, textBaseline);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...palette.textMuted);
        doc.text(
          `${row.subtopicsCompleted}/${row.subtopicsTotal}`,
          startTableX + colWidth - 134,
          textBaseline,
          { align: 'right' }
        );

        doc.text(
          row.quizScore !== null ? `${row.quizScore}%` : '—',
          startTableX + colWidth - 88,
          textBaseline,
          { align: 'right' }
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.6);
        if (row.status === 'completed') {
          doc.setTextColor(...palette.success);
          doc.text('Completed', startTableX + colWidth - 8, textBaseline, { align: 'right' });
        } else if (row.status === 'in-progress') {
          doc.setTextColor(...palette.accent);
          doc.text('In Progress', startTableX + colWidth - 8, textBaseline, { align: 'right' });
        } else {
          doc.setTextColor(...palette.textMuted);
          doc.text('Pending', startTableX + colWidth - 8, textBaseline, { align: 'right' });
        }
      });
    };

    renderHalfTable(summary.days.slice(0, 15), 44);
    renderHalfTable(summary.days.slice(15, 30), 44 + colWidth + colGap);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...palette.textMuted);
    doc.text(
      `Summary Notes Logged: ${summary.notesCount}  ·  Bookmarked Subtopics: ${summary.bookmarksCount}  ·  Credential ID: ${summary.certificateId}`,
      44,
      pageHeight - 36
    );
  }

  return doc;
}

export function buildCertificatePdfBlob(
  summary: CertificateSummary,
  options?: PdfExportOptions
): Blob {
  const doc = createCertificatePdfDocument(summary, options);
  return doc.output('blob');
}

export function downloadCertificatePdf(
  summary: CertificateSummary,
  options: PdfExportOptions = { theme: 'ivory', includeTranscript: true }
): { filename: string; pageCount: number } {
  const doc = createCertificatePdfDocument(summary, options);
  const slug = sanitizeFilenameSegment(summary.recipientName);
  const filename = `python-visual-lab-certificate-${slug}-${summary.issuedDateIso}.pdf`;
  doc.save(filename);
  return {
    filename,
    pageCount: options.includeTranscript ? 2 : 1,
  };
}
