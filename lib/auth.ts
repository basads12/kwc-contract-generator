export const AUTH_COOKIE = "kwc_admin_session";

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "kwc-dev-secret-change-me"
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return bufferToHex(signature);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export async function createSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "";
  return hmacSha256(password, getAuthSecret());
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const expected = await createSessionToken();
  if (!expected) return false;
  return timingSafeEqualStrings(token, expected);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqualStrings(password, expected);
}
