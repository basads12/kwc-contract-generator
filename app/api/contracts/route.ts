import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContractNumber } from "@/lib/contracts";
import { isValidContractStatus } from "@/lib/contract-status";
import { parseFormDataWithDocument, parseContractStatus, toPrismaJson } from "@/lib/validation";
import { resolveTemplateId } from "@/lib/resolveTemplate";
import type { ContractStatus } from "@prisma/client";

const ALLOWED_CREATE_STATUSES: ContractStatus[] = [
  "CONCEPT",
  "KLAAR_VOOR_ONDERTEKENING",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const status =
      statusParam && isValidContractStatus(statusParam)
        ? statusParam
        : undefined;

    const contracts = await prisma.contract.findMany({
      where: status ? { status } : undefined,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        contractNumber: true,
        status: true,
        locked: true,
        formData: true,
        signedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/contracts", error);
    return NextResponse.json(
      { error: "Database niet beschikbaar. Controleer DATABASE_URL." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = parseFormDataWithDocument(body.formData);
    const status = body.status
      ? parseContractStatus(body.status)
      : "CONCEPT";

    if (!ALLOWED_CREATE_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Alleen concept of klaar voor ondertekening toegestaan bij aanmaken" },
        { status: 400 }
      );
    }

    const contractNumber = await generateContractNumber();
    const templateId = await resolveTemplateId(
      formData.templateSlug,
      body.templateId
    );

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        status,
        formData: toPrismaJson(formData),
        templateId,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("POST /api/contracts", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Opslaan mislukt" },
      { status: 400 }
    );
  }
}
