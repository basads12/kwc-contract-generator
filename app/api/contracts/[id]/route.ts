import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  canTransitionStatus,
  getStatusAfterIncassoAcknowledge,
} from "@/lib/contract-status";
import {
  parseFormDataWithDocument,
  parseContractStatus,
  toPrismaJson,
} from "@/lib/validation";
import { resolveTemplateId } from "@/lib/resolveTemplate";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }
    return NextResponse.json(contract);
  } catch (error) {
    console.error("GET /api/contracts/[id]", error);
    return NextResponse.json({ error: "Database fout" }, { status: 503 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    const body = await request.json();
    const data: Prisma.ContractUpdateInput = {};

    const isIncassoOnly =
      typeof body.incassoAcknowledged === "boolean" &&
      !body.formData &&
      !body.status;
    const isStatusOnly =
      body.status === "AFGEROND" && !body.formData && !body.incassoAcknowledged;

    if (existing.locked && !isIncassoOnly && !isStatusOnly) {
      return NextResponse.json(
        { error: "Contract is vergrendeld na ondertekening" },
        { status: 403 }
      );
    }

    if (body.formData) {
      const formData = parseFormDataWithDocument(body.formData);
      data.formData = toPrismaJson(formData);
      const resolvedTemplateId = await resolveTemplateId(
        formData.templateSlug,
        body.templateId
      );
      if (resolvedTemplateId) {
        data.template = { connect: { id: resolvedTemplateId } };
      }
    }

    if (body.status) {
      const nextStatus = parseContractStatus(body.status);
      if (
        !canTransitionStatus(existing.status, nextStatus, existing.locked)
      ) {
        return NextResponse.json(
          { error: `Statuswijziging van ${existing.status} naar ${nextStatus} is niet toegestaan` },
          { status: 403 }
        );
      }
      data.status = nextStatus;
    }

    if (typeof body.incassoAcknowledged === "boolean") {
      if (!existing.locked) {
        return NextResponse.json(
          { error: "Incasso is pas beschikbaar na ondertekening" },
          { status: 403 }
        );
      }

      data.incassoAcknowledged = body.incassoAcknowledged;
      data.incassoPreparedAt = body.incassoAcknowledged ? new Date() : null;
      data.status = getStatusAfterIncassoAcknowledge(
        existing.status,
        body.incassoAcknowledged
      );

      if (
        !body.incassoAcknowledged &&
        existing.status === "INCASSO_VOORBEREID"
      ) {
        data.status = existing.emailSentAt
          ? "KLANTLINK_VERZONDEN"
          : "GETEKEND";
      }
    }

    const contract = await prisma.contract.update({
      where: { id },
      data,
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error("PATCH /api/contracts/[id]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bijwerken mislukt" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }
    if (existing.locked) {
      return NextResponse.json(
        { error: "Getekend contract kan niet worden verwijderd" },
        { status: 403 }
      );
    }
    await prisma.contract.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/contracts/[id]", error);
    return NextResponse.json({ error: "Verwijderen mislukt" }, { status: 503 });
  }
}
