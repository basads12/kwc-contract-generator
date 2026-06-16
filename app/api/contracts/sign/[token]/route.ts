import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getContractPdfBlobPath } from "@/lib/contractPdfUpload";
import { prisma } from "@/lib/prisma";
import { canSignContract } from "@/lib/contract-status";

type RouteContext = { params: Promise<{ token: string }> };

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "onbekend"
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { customerToken: token },
      select: {
        contractNumber: true,
        status: true,
        locked: true,
        formData: true,
        signedAt: true,
      },
    });
    if (!contract) {
      return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
    }
    return NextResponse.json(contract);
  } catch (error) {
    console.error("GET /api/contracts/sign/[token]", error);
    return NextResponse.json({ error: "Database fout" }, { status: 503 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { customerToken: token },
    });

    if (!contract) {
      return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
    }

    if (contract.locked) {
      return NextResponse.json(
        { error: "Contract is al ondertekend" },
        { status: 409 }
      );
    }

    if (!canSignContract(contract.status, contract.locked)) {
      return NextResponse.json(
        {
          error:
            "Contract is nog niet klaar voor ondertekening. Markeer het eerst als 'klaar voor ondertekening'.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { signatureDataUrl, signerName, signerEmail, pdfBase64 } = body;

    if (!signatureDataUrl || !signerName?.trim() || !signerEmail?.trim()) {
      return NextResponse.json(
        { error: "Handtekening, naam en e-mail zijn verplicht" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(signerEmail.trim())) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    const signatureBuffer = Buffer.from(
      signatureDataUrl.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    let signatureUrl: string;
    try {
      const signatureBlob = await put(
        `contracts/${contract.contractNumber}/handtekening.png`,
        signatureBuffer,
        { access: "public", contentType: "image/png" }
      );
      signatureUrl = signatureBlob.url;
    } catch (blobError) {
      console.error("Blob upload handtekening", blobError);
      return NextResponse.json(
        {
          error:
            "Handtekening opslaan mislukt. Controleer BLOB_READ_WRITE_TOKEN.",
        },
        { status: 503 }
      );
    }

    let pdfUrl: string | null = null;
    if (pdfBase64) {
      const pdfBuffer = Buffer.from(pdfBase64, "base64");
      const pdfBlob = await put(
        getContractPdfBlobPath(contract.contractNumber, contract.formData),
        pdfBuffer,
        { access: "public", contentType: "application/pdf" }
      );
      pdfUrl = pdfBlob.url;
    }

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: {
        locked: true,
        status: "GETEKEND",
        signatureUrl,
        signerName: signerName.trim(),
        signerEmail: signerEmail.trim(),
        signedAt: new Date(),
        signerIp: getClientIp(request),
        signerUserAgent: request.headers.get("user-agent") ?? "onbekend",
        pdfUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/contracts/sign/[token]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ondertekenen mislukt" },
      { status: 500 }
    );
  }
}
