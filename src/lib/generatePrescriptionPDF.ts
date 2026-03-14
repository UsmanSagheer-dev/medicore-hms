import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface GeneratePDFParams {
  elementRef: React.RefObject<HTMLDivElement | null>;
  patientName?: string;
}

export const generatePrescriptionPDF = async ({
  elementRef,
  patientName = "Patient",
}: GeneratePDFParams): Promise<void> => {
  if (!elementRef.current) {
    alert("Could not generate PDF");
    return;
  }

  try {
    // Small delay to ensure all content is rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      allowTaint: true,
      imageTimeout: 0,
      windowHeight: elementRef.current.scrollHeight,
      onclone: (clonedDocument) => {
        // Create a style to fix colors but preserve text visibility
        const style = clonedDocument.createElement("style");
        style.textContent = `
          * {
            border-color: #d1d5db !important;
          }
          body, div {
            color: #000 !important;
          }
          .bg-white { background-color: white !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-blue-900 { color: #1e3a8a !important; }
          .border-gray-800 { border-color: #1f2937 !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
        `;
        clonedDocument.head.appendChild(style);
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    const fileName = `Prescription_${patientName}_${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}.pdf`;
    pdf.save(fileName);

    console.log("✅ PDF generated successfully:", fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Could not generate PDF. Please try again.");
  }
};
