export async function generateContractPdfBlob(
  rootElement: HTMLElement
): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const pages = rootElement.querySelectorAll<HTMLElement>(".a4-page");
  const targets = pages.length > 0 ? Array.from(pages) : [rootElement];

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let i = 0; i < targets.length; i++) {
    const canvas = await html2canvas(targets[i], {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pageWidth = 210;
    const pageHeight = 297;
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const offsetX = (pageWidth - imgWidth) / 2;
    const offsetY = 0;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", offsetX, offsetY, imgWidth, imgHeight);
  }

  return pdf.output("blob");
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
