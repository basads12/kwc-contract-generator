import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { BUILTIN_TEMPLATES } from "@/lib/templates";
import { parseDocumentContent } from "@/lib/documentContent";
import { parseFormData, toPrismaJson, toPrismaJsonValue } from "@/lib/validation";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function ensureBuiltInTemplates() {
  for (const template of BUILTIN_TEMPLATES) {
    await prisma.contractTemplate.upsert({
      where: { id: template.id },
      update: {
        slug: template.slug,
        name: template.name,
        description: template.description,
        isBuiltIn: true,
        baseTemplateSlug: template.slug,
        sortOrder: template.sortOrder,
      },
      create: {
        id: template.id,
        slug: template.slug,
        name: template.name,
        description: template.description,
        isBuiltIn: true,
        baseTemplateSlug: template.slug,
        sortOrder: template.sortOrder,
      },
    });
  }
}

async function createUniqueSlug(baseName: string): Promise<string> {
  const slugBase = slugify(baseName) || "sjabloon";
  let slug = slugBase;
  let suffix = 2;
  while (await prisma.contractTemplate.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

export async function GET() {
  try {
    await ensureBuiltInTemplates();
    const templates = await prisma.contractTemplate.findMany({
      orderBy: [{ isBuiltIn: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("GET /api/templates", error);
    return NextResponse.json(
      { error: "Sjablonen laden mislukt" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureBuiltInTemplates();
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const name = String(body.name ?? "").trim();
      const description = String(body.description ?? "").trim();
      const baseTemplateSlug = String(body.baseTemplateSlug ?? "sjabloon-1");

      if (!name) {
        return NextResponse.json(
          { error: "Naam is verplicht" },
          { status: 400 }
        );
      }

      const slug = await createUniqueSlug(name);
      const defaultFormData = body.defaultFormData
        ? toPrismaJson(parseFormData(body.defaultFormData))
        : undefined;
      const documentContent = body.documentContent
        ? toPrismaJsonValue(parseDocumentContent(body.documentContent) ?? {})
        : undefined;

      const template = await prisma.contractTemplate.create({
        data: {
          slug,
          name,
          description: description || null,
          isBuiltIn: false,
          baseTemplateSlug,
          defaultFormData,
          documentContent,
          sortOrder: 100,
        },
      });

      return NextResponse.json(template, { status: 201 });
    }

    const form = await request.formData();
    const file = form.get("file");
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Kies een bestand (DOCX of PDF)" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".docx") &&
      !file.name.endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Alleen DOCX of PDF toegestaan" },
        { status: 400 }
      );
    }

    const baseName = name || file.name.replace(/\.[^.]+$/, "");
    const slug = await createUniqueSlug(baseName);

    const blob = await put(`templates/${slug}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    const template = await prisma.contractTemplate.create({
      data: {
        slug,
        name: baseName,
        description: description || null,
        fileUrl: blob.url,
        fileName: file.name,
        isBuiltIn: false,
        baseTemplateSlug: "sjabloon-1",
        sortOrder: 100,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("POST /api/templates", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Opslaan mislukt" },
      { status: 400 }
    );
  }
}
