import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDownloadUrl } from "@/lib/contracts";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }
    if (!contract.locked) {
      return NextResponse.json(
        { error: "Contract moet eerst ondertekend zijn" },
        { status: 400 }
      );
    }

    if (
      contract.status !== "GETEKEND" &&
      contract.status !== "KLANTLINK_VERZONDEN"
    ) {
      return NextResponse.json(
        { error: "E-mail kan alleen na ondertekening worden verstuurd" },
        { status: 403 }
      );
    }

    const downloadUrl = getDownloadUrl(contract.customerToken);
    const contactEmail = contract.signerEmail ?? "";
    const contactName =
      contract.signerName ??
      (contract.formData as { contactpersoon?: string }).contactpersoon ??
      "klant";

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        emailSentAt: new Date(),
        status: "KLANTLINK_VERZONDEN",
      },
    });

    const subject = encodeURIComponent(
      `Uw ondertekende overeenkomst — ${contract.contractNumber}`
    );
    const body = encodeURIComponent(
      `Beste ${contactName},\n\nUw ondertekende overeenkomst (${contract.contractNumber}) is beschikbaar via onderstaande link:\n\n${downloadUrl}\n\nMet vriendelijke groet,\nGalerie de Kunst van Kunst`
    );
    const mailto = contactEmail
      ? `mailto:${contactEmail}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;

    return NextResponse.json({
      contract: updated,
      downloadUrl,
      mailto,
      message:
        "E-mailprovider nog niet gekoppeld. Gebruik de mailto-link of kopieer de downloadlink.",
    });
  } catch (error) {
    console.error("POST /api/contracts/[id]/send-email", error);
    return NextResponse.json({ error: "Verzenden mislukt" }, { status: 500 });
  }
}
