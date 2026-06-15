import { prisma } from "@/lib/prisma";
import { SIJABLOON_1_ID } from "@/lib/templateConstants";
import { getBuiltInTemplate } from "@/lib/templates";

export async function resolveTemplateId(
  templateSlug?: string | null,
  templateId?: string | null
): Promise<string | null> {
  if (templateId) return templateId;
  if (!templateSlug) return SIJABLOON_1_ID;
  const builtIn = getBuiltInTemplate(templateSlug);
  if (builtIn) return builtIn.id;
  const uploaded = await prisma.contractTemplate.findUnique({
    where: { slug: templateSlug },
  });
  return uploaded?.id ?? SIJABLOON_1_ID;
}
