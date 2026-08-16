import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { members } from "../../../db/schema";
import { clearMemberCookie, getCurrentMember, memberCookie, normalizePhone, publicMember, validateMemberIdentity } from "../../../lib/member-auth";

export const runtime = "nodejs";

const optionalText = (value: unknown, max = 160) => String(value || "").trim().slice(0, max);

export async function GET() {
  const member = await getCurrentMember();
  return NextResponse.json({ member: member ? publicMember(member) : null });
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "회원 시스템이 아직 연결되지 않았습니다." }, { status: 503 });
  try {
    const body = await request.json().catch(() => ({}));
    const { name, phone } = validateMemberIdentity(body.name, body.phone);
    const existing = await db.select().from(members).where(eq(members.phone, phone)).limit(1);
    const result = existing[0]
      ? await db.update(members).set({ name, updatedAt: new Date() }).where(eq(members.id, existing[0].id)).returning()
      : await db.insert(members).values({ name, phone, recipientName: name, recipientPhone: phone }).returning();
    const member = result[0];
    const response = NextResponse.json({ ok: true, member: publicMember(member), message: existing[0] ? "로그인되었습니다." : "회원가입과 로그인이 완료되었습니다." });
    response.cookies.set(memberCookie(member.id));
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "회원 정보를 확인해주세요." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "회원 시스템이 아직 연결되지 않았습니다." }, { status: 503 });
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const recipientPhone = normalizePhone(body.recipientPhone || member.phone);
  if (recipientPhone && !/^01[0-9]{8,9}$/.test(recipientPhone)) return NextResponse.json({ error: "수령인 연락처를 확인해주세요." }, { status: 400 });
  const result = await db.update(members).set({ recipientName: optionalText(body.recipientName, 40), recipientPhone, postalCode: optionalText(body.postalCode, 12), address: optionalText(body.address, 200), detailAddress: optionalText(body.detailAddress, 200), deliveryNote: optionalText(body.deliveryNote, 120), updatedAt: new Date() }).where(eq(members.id, member.id)).returning();
  return NextResponse.json({ ok: true, member: publicMember(result[0]) });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearMemberCookie());
  return response;
}
