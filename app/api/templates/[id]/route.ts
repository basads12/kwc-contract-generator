import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDocumentContent } from "@/lib/documentContent";
import { parseFormData, toPrismaJson, toPrismaJsonValue } from "@/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await prisma.contractTemplate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Sjabloon niet gevonden" }, { status: 404 });
    }
    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: "Ingebouwde sjablonen kunnen niet worden bewerkt" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data: {
      name?: string;
      description?: string | null;
      defaultFormData?: ReturnType<typeof toPrismaJson>;
      documentContent?: ReturnType<typeof toPrismaJson>;
    } = {};

    if (typeof body.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    }
    if ("description" in body) {
      data.description = String(body.description ?? "").trim() || null;
    }
    if (body.defaultFormData) {
      data.defaultFormData = toPrismaJson(parseFormData(body.defaultFormData));
    }
    if (body.documentContent) {
      data.documentContent = toPrismaJsonValue(
        parseDocumentContent(body.documentContent) ?? {}
      );
    }

    const template = await prisma.contractTemplate.update({
      where: { id },
      data,
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("PATCH /api/templates/[id]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bijwerken mislukt" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await prisma.contractTemplate.findUnique({
      where: { id },
      include: { _count: { select: { contracts: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Sjabloon niet gevonden" }, { status: 404 });
    }
    if (existing.isBuiltIn) {
      return NextResponse.json(
        { error: "Ingebouwde sjablonen kunnen niet worden verwijderd" },
        { status: 403 }
      );
    }
    if (existing._count.contracts > 0) {
      return NextResponse.json(
        { error: "Sjabloon is gekoppeld aan contracten en kan niet worden verwijderd" },
        { status: 409 }
      );
    }

    await prisma.contractTemplate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/templates/[id]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verwijderen mislukt" },
      { status: 400 }
    );
  }
}
