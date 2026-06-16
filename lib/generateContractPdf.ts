import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  A4_WIDTH_PX,
  prepareContractForCapture,
} from "./printContract";

export async function generateContractPdfBlob(
  rootElement: HTMLElement
): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const restore = prepareContractForCapture(rootElement);
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));

  try {
    const pages = rootElement.querySelectorAll<HTMLElement>(".a4-page");
    const targets = pages.length > 0 ? Array.from(pages) : [rootElement];

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const heightPx = Math.round((A4_HEIGHT_MM * 96) / 25.4);

    for (let i = 0; i < targets.length; i++) {
      const canvas = await html2canvas(targets[i], {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: Math.round(A4_WIDTH_PX),
        height: heightPx,
        windowWidth: Math.round(A4_WIDTH_PX),
        windowHeight: heightPx,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    }

    return pdf.output("blob");
  } finally {
    restore();
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
