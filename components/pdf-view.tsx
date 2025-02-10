"use client";

import { useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Subject {
  name: string;
  lectureCredits: number;
  tutorialCredits: number;
  practicalCredits: number;
  cie1: number;
  cie2: number;
  cie3: number;
  internalAssessment: number;
  labMarks: number;
  quizMarks: number;
  estimatedGrade: string;
  seeMarks: number;
}

interface PDFViewProps {
  subjects: Subject[];
  semester: number;
  sgpa: number;
  calculateInternalMarks: (subject: Subject) => number;
  calculateRequiredExternalMarks: (subject: Subject, internalMarks: number) => number;
  onClose: () => void;
}

export function PDFView({
  subjects,
  semester,
  sgpa,
  calculateInternalMarks,
  calculateRequiredExternalMarks,
  onClose,
}: PDFViewProps) {
  useEffect(() => {
    const generatePDF = () => {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text("Academic Performance Summary", 20, 20);

      // Add semester info
      doc.setFontSize(12);
      doc.text(`Semester: ${semester}`, 20, 30);
      doc.text(`Expected SGPA: ${sgpa}`, 20, 40);

      // Prepare table data
      const tableData = subjects.map((subject) => {
        const internalMarks = calculateInternalMarks(subject);
        const requiredExternal = calculateRequiredExternalMarks(subject, internalMarks);

        return [
          subject.name || "Unnamed Subject",
          `${subject.lectureCredits}-${subject.tutorialCredits}-${subject.practicalCredits}`,
          internalMarks.toFixed(2),
          subject.estimatedGrade,
          requiredExternal.toFixed(2),
        ];
      });

      // Add table
      autoTable(doc, {
        head: [["Subject", "Credits (L-T-P)", "Internal Marks", "Est. Grade", "Req. External"]],
        body: tableData,
        startY: 50,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });

      // Open PDF in new tab
      const pdfOutput = doc.output("bloburl");
      window.open(pdfOutput, "_blank");
      onClose();
    };

    generatePDF();
  }, [subjects, semester, sgpa, calculateInternalMarks, calculateRequiredExternalMarks, onClose]);

  return null;
}