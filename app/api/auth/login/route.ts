import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  createSessionToken,
  isAuthConfigured,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is niet geconfigureerd" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const password = body.password ?? "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Onjuist wachtwoord" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
