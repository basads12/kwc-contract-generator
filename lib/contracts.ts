import { prisma } from "./prisma";

export async function generateContractNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `KWC-${year}-`;

  const latest = await prisma.contract.findFirst({
    where: { contractNumber: { startsWith: prefix } },
    orderBy: { contractNumber: "desc" },
    select: { contractNumber: true },
  });

  let next = 1;
  if (latest) {
    const part = latest.contractNumber.replace(prefix, "");
    const num = parseInt(part, 10);
    if (!Number.isNaN(num)) next = num + 1;
  }

  return `${prefix}${String(next).padStart(4, "0")}`;
}

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getSignUrl(token: string): string {
  return `${getAppBaseUrl()}/tekenen/${token}`;
}

export function getDownloadUrl(token: string): string {
  return `${getAppBaseUrl()}/download/${token}`;
}
