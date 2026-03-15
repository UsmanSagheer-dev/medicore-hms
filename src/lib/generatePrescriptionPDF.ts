import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const A4_RENDER_WIDTH_PX = 794;
const A4_RENDER_HEIGHT_PX = 1123;

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface GeneratePDFParams {
  patientName?: string;
  tokenNo?: string | number;
  age?: string | number;
  gender?: string;
  visitType?: string;
  symptoms?: string[];
  diagnoses?: string[];
  medicines?: Medicine[];
  nextFollowUp?: string;
  testRecommendations?: string;
  doctorName?: string;
  doctorSpecialization?: string;
  doctorQualifications?: string;
  doctorPhone?: string;
  doctorEmail?: string;
  clinicAddress?: string;
}

function buildPrescriptionHTML(data: GeneratePDFParams): string {
  const {
    patientName = "",
    tokenNo = "",
    age = "",
    gender = "",
    visitType = "New",
    symptoms = [],
    diagnoses = [],
    medicines = [],
    nextFollowUp = "",
    doctorName = "Doctor",
    doctorSpecialization = "Specialist Doctor",
    doctorQualifications = "---",
    doctorPhone = "+92 XXX-XXXXXXX",
    doctorEmail = "doctor@clinic.com",
    clinicAddress = "123 Medical Plaza, Healthcare City",
  } = data;

  const today = new Date().toLocaleDateString();
  const followUpDate = nextFollowUp
    ? new Date(nextFollowUp).toLocaleDateString()
    : "";

  const symptomsHTML =
    symptoms.length > 0
      ? symptoms
          .map(
            (s) =>
              `<p style="margin:4px 0;font-size:13px;color:#374151;font-family:Arial,sans-serif;">• ${s}</p>`,
          )
          .join("")
      : `<p style="font-size:12px;color:#9ca3af;font-style:italic;font-family:Arial,sans-serif;">No symptoms added</p>`;

  const diagnosesHTML =
    diagnoses.length > 0
      ? diagnoses
          .map(
            (d) =>
              `<p style="margin:4px 0;font-size:13px;color:#374151;font-family:Arial,sans-serif;">• ${d}</p>`,
          )
          .join("")
      : `<p style="font-size:12px;color:#9ca3af;font-style:italic;font-family:Arial,sans-serif;">No diagnosis added</p>`;

  const medicinesHTML =
    medicines.length > 0
      ? medicines
          .map(
            (m, i) => `
          <div style="display:flex;gap:10px;margin-bottom:10px;">
            <span style="font-weight:700;color:#374151;min-width:20px;font-size:13px;font-family:Arial,sans-serif;">${i + 1}.</span>
            <div>
              <p style="margin:0;font-weight:600;color:#111827;font-size:13px;font-family:Arial,sans-serif;">${m.name}</p>
              <p style="margin:2px 0 0;font-size:12px;color:#4b5563;font-family:Arial,sans-serif;">${[
                m.dosage,
                m.frequency,
                m.duration,
              ]
                .filter(Boolean)
                .join(" - ")}</p>
            </div>
          </div>`,
          )
          .join("")
      : `<p style="font-size:12px;color:#9ca3af;font-style:italic;font-family:Arial,sans-serif;">No medicines added yet</p>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;min-height:100%;}body{font-family:Arial,sans-serif;background:#fff;}</style>
</head>
<body>
<div style="width:100%;min-height:100%;background:#ffffff;overflow:hidden;border:1px solid #e5e7eb;">

  <!-- HEADER -->
  <div style="position:relative;height:118px;background:#ffffff;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;width:100%;height:8px;background:#7bb534;z-index:3;"></div>
    <div style="position:absolute;left:0;top:8px;width:56%;height:110px;z-index:1;">
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none' width='100%' height='100%' style="display:block;">
        <polygon points='0,0 100,0 93,100 0,100' fill='#7bb534' />
      </svg>
    </div>
    <div style="position:absolute;left:0;top:8px;width:46%;height:110px;z-index:2;display:flex;flex-direction:column;justify-content:center;padding:0 24px;">
      <p style="font-weight:700;color:#ffffff;font-size:17px;line-height:1.2;font-family:Arial,sans-serif;">Dr. ${doctorName}</p>
      <p style="font-size:12px;color:#ffffff;opacity:0.9;margin-top:2px;font-family:Arial,sans-serif;">${doctorSpecialization}</p>
      <p style="font-size:11px;color:#ffffff;opacity:0.8;margin-top:4px;font-family:Arial,sans-serif;">Qualification: ${doctorQualifications}</p>
    </div>
    <div style="position:absolute;left:54%;top:50%;transform:translate(-50%,-50%);z-index:5;background:#7bb534;border-radius:50%;width:52px;height:52px;border:3px solid #ffffff;display:flex;align-items:center;justify-content:center;">
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='28' height='28'><path d='M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z'/><path d='M11 13H9v-2h2V9h2v2h2v2h-2v2h-2v-2z' fill='white'/></svg>
    </div>
    <div style="position:absolute;right:0;top:8px;width:34%;height:110px;z-index:2;display:flex;flex-direction:column;justify-content:flex-end;padding:0 20px 8px;">
      <p style="font-weight:700;font-size:11px;color:#7bb534;font-family:Arial,sans-serif;">WHEN PATIENTS VISIT</p>
      <p style="font-size:10px;color:#374151;margin-top:3px;font-family:Arial,sans-serif;">MORNING:- 8AM – 11:30AM</p>
      <p style="font-size:10px;color:#374151;font-family:Arial,sans-serif;">NOON:- 3PM – 9PM</p>
      <p style="font-size:10px;color:#374151;font-family:Arial,sans-serif;">SUNDAY OFF DAY</p>
      <p style="font-size:10px;color:#9ca3af;margin-top:3px;font-family:Arial,sans-serif;">your webpage name here</p>
      <p style="font-size:10px;color:#9ca3af;font-family:Arial,sans-serif;">your mail name here</p>
    </div>
  </div>

  <!-- PATIENT INFO -->
  <div style="padding:16px 24px;background:#e7efda;border-top:4px solid #111827;margin-top:8px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;">
      <div style="display:flex;align-items:flex-end;gap:4px;">
        <span style="display:inline-block;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;font-family:Arial,sans-serif;">S. No.</span>
        <span style="display:inline-block;border-bottom:2px solid #9ca3af;font-weight:600;color:#4b5563;font-size:13px;line-height:1.15;padding:0 4px 3px;font-family:Arial,sans-serif;">#${String(tokenNo).padStart(2, "0")}</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:4px;">
        <span style="display:inline-block;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;font-family:Arial,sans-serif;">Date:</span>
        <span style="display:inline-block;border-bottom:2px solid #9ca3af;color:#374151;font-size:13px;line-height:1.15;padding:0 4px 3px;font-family:Arial,sans-serif;">${today}</span>
      </div>
    </div>
    <div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:10px;">
      <span style="display:inline-block;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;white-space:nowrap;font-family:Arial,sans-serif;">Patient Name:</span>
      <span style="display:block;border-bottom:2px solid #9ca3af;flex:1;color:#374151;font-size:13px;line-height:1.15;padding:0 4px 3px;font-family:Arial,sans-serif;">${patientName || "___________________________"}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;">
      <div style="display:flex;align-items:flex-end;gap:1px;min-width:0;">
        <span style="display:inline-block;width:44px;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;font-family:Arial,sans-serif;">Age:</span>
        <span style="display:block;border-bottom:2px solid #9ca3af;flex:1;min-width:0;color:#374151;font-size:13px;line-height:1.15;padding:0 2px 3px;font-family:Arial,sans-serif;">${age || "---"}</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:2px;min-width:0;">
        <span style="display:inline-block;width:62px;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;font-family:Arial,sans-serif;">Gender:</span>
        <span style="display:block;border-bottom:2px solid #9ca3af;flex:1;min-width:0;color:#374151;font-size:13px;line-height:1.15;padding:0 2px 3px;font-family:Arial,sans-serif;">${gender || "---"}</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:2px;min-width:0;">
        <span style="display:inline-block;width:62px;font-weight:700;color:#374151;font-size:13px;line-height:1.15;padding-bottom:3px;white-space:nowrap;font-family:Arial,sans-serif;">Visit Type:</span>
        <span style="display:block;border-bottom:2px solid #9ca3af;flex:1;min-width:0;color:#374151;font-size:13px;line-height:1.15;padding:0 2px 3px;font-family:Arial,sans-serif;">${visitType || "New"}</span>
      </div>
    </div>
  </div>

  <!-- COMPLAINT + MEDICINES -->
  <div style="display:flex;min-height:775px;border-top:1px solid #111827;border-bottom:1px solid #111827;">
    <div style="width:35%;border-right:2px solid #111827;display:flex;flex-direction:column;">
      <div style="flex:1;padding:20px;border-bottom:1px solid #e5e7eb;">
        <p style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:10px;letter-spacing:0.5px;font-family:Arial,sans-serif;">Chief Complaint</p>
        ${symptomsHTML}
      </div>
      <div style="flex:1;padding:20px;">
        <p style="font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;margin-bottom:10px;letter-spacing:0.5px;font-family:Arial,sans-serif;">Diagnosis</p>
        ${diagnosesHTML}
      </div>
    </div>
    <div style="width:65%;padding:16px 20px;">
      <p style="font-size:38px;font-weight:700;color:#374151;margin-bottom:12px;font-family:serif;">&#8478;</p>
      ${medicinesHTML}
    </div>
  </div>

  <!-- SIGNATURE + FOLLOW-UP -->
  <div style="padding:20px 24px 10px;">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px;">
      <div style="display:flex;align-items:flex-end;gap:8px;flex:1;">
        <span style="display:inline-block;font-size:11px;font-weight:700;color:#374151;line-height:1.15;padding-bottom:2px;text-transform:uppercase;white-space:nowrap;font-family:Arial,sans-serif;">Doctor Signature:</span>
        <div style="flex:1;border-bottom:1px solid #111827;margin-bottom:2px;"></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;white-space:nowrap;font-family:Arial,sans-serif;">Next Follow-up:</span>
        ${
          followUpDate
            ? `<span style="display:inline-block;font-size:13px;font-weight:600;color:#1e3a8a;line-height:1.15;border-bottom:2px solid #374151;padding:0 2px 3px;font-family:Arial,sans-serif;">${followUpDate}</span>`
            : `<span style="font-size:12px;color:#6b7280;font-style:italic;font-family:Arial,sans-serif;">No Follow-up Needed</span>`
        }
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:12px 24px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div style="display:flex;align-items:flex-start;gap:8px;">
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#2563eb' stroke-width='2' style="flex-shrink:0;margin-top:1px;"><path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z'/></svg>
        <div>
          <p style="font-size:11px;color:#4b5563;margin-bottom:2px;font-family:Arial,sans-serif;">${doctorPhone}</p>
          <p style="font-size:11px;color:#4b5563;font-family:Arial,sans-serif;">${doctorEmail}</p>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:8px;">
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#dc2626' stroke-width='2' style="flex-shrink:0;margin-top:1px;"><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z'/><circle cx='12' cy='10' r='3'/></svg>
        <p style="font-size:11px;color:#4b5563;font-family:Arial,sans-serif;">${clinicAddress}</p>
      </div>
    </div>
  </div>

</div>
</body></html>`;
}

export const generatePrescriptionPDF = async (
  params: GeneratePDFParams,
): Promise<void> => {
  try {
    console.log("📄 Starting PDF generation...");

    const html = buildPrescriptionHTML(params);

    // Create hidden iframe to render clean HTML without any Tailwind/lab() colors
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `position:fixed;top:-9999px;left:-9999px;width:${A4_RENDER_WIDTH_PX}px;height:${A4_RENDER_HEIGHT_PX}px;border:none;visibility:hidden;`;
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Could not access iframe document");

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    // Wait for render
    await new Promise((resolve) => setTimeout(resolve, 400));

    const prescriptionEl = iframeDoc.body.firstElementChild as HTMLElement;
    if (!prescriptionEl)
      throw new Error("Could not find prescription element in iframe");

    console.log("📸 Capturing iframe content...");

    const canvas = await html2canvas(prescriptionEl, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: prescriptionEl.scrollWidth,
      height: prescriptionEl.scrollHeight,
    });

    document.body.removeChild(iframe);
    console.log("✅ Canvas created");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Prescription_${params.patientName || "Patient"}_${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}.pdf`;

    pdf.save(fileName);
    console.log("✅ PDF saved:", fileName);
    alert("PDF downloaded successfully!");
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    alert("Could not generate PDF. Check console for details.");
  }
};
