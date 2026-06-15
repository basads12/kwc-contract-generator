import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }
    if (!contract.locked) {
      return NextResponse.json(
        { error: "Alleen getekende contracten kunnen een definitieve PDF hebben" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Geen PDF-bestand" }, { status: 400 });
    }

    const blob = await put(
      `contracts/${contract.contractNumber}/definitief.pdf`,
      file,
      { access: "public", addRandomSuffix: false }
    );

    const updated = await prisma.contract.update({
      where: { id },
      data: { pdfUrl: blob.url },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/contracts/[id]/pdf", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF upload mislukt" },
      { status: 500 }
    );
  }
}
