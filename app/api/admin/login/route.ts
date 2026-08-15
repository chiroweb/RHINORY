import { NextResponse } from "next/server";
import { adminCookie, isValidAdminKey } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const key = typeof body.key === "string" ? body.key : "";
  if (!process.env.ADMIN_ACCESS_KEY && process.env.NODE_ENV === "production") return NextResponse.json({ error: "ADMIN_ACCESS_KEY is not configured." }, { status: 503 });
  if (!isValidAdminKey(key)) return NextResponse.json({ error: "관리자 키가 올바르지 않습니다." }, { status: 401 });
  const cookie = adminCookie();
  const response = NextResponse.json({ ok: true });
  if (cookie) response.cookies.set({ name: cookie.name, value: cookie.value, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}
