import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ token: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { customerToken: token },
    });
    if (!contract) {
      return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
    }
    if (!contract.locked) {
      return NextResponse.json(
        { error: "Contract moet eerst ondertekend zijn" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { pdfBase64 } = body;
    if (!pdfBase64 || typeof pdfBase64 !== "string") {
      return NextResponse.json({ error: "Geen PDF-data" }, { status: 400 });
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const blob = await put(
      `contracts/${contract.contractNumber}/definitief.pdf`,
      pdfBuffer,
      { access: "public", contentType: "application/pdf" }
    );

    const updated = await prisma.contract.update({
      where: { id: contract.id },
      data: { pdfUrl: blob.url },
      select: { pdfUrl: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/contracts/by-token/[token]/pdf", error);
    const message =
      error instanceof Error ? error.message : "PDF upload mislukt";
    const isBlob =
      message.includes("BLOB_READ_WRITE_TOKEN") ||
      message.includes("No token found");
    return NextResponse.json(
      {
        error: isBlob
          ? "PDF-opslag niet geconfigureerd (BLOB_READ_WRITE_TOKEN)"
          : message,
      },
      { status: 500 }
    );
  }
}
