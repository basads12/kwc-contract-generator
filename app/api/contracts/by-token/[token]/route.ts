import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ token: string }> };

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
        signatureUrl: true,
        signerName: true,
        pdfUrl: true,
      },
    });
    if (!contract) {
      return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
    }
    return NextResponse.json(contract);
  } catch (error) {
    console.error("GET /api/contracts/by-token", error);
    return NextResponse.json({ error: "Database fout" }, { status: 503 });
  }
}
