import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { members } from "../db/schema";

const COOKIE_NAME = "rhinory_member_session";

function sessionSecret() {
  const configured = process.env.MEMBER_SESSION_SECRET || process.env.AUTH_SECRET;
  if (configured) return configured;
  return process.env.NODE_ENV !== "production" ? process.env.ADMIN_ACCESS_KEY || "rhinory-member-local" : null;
}

export function normalizePhone(value: unknown) {
  return String(value || "").replace(/[^0-9]/g, "");
}

export function validateMemberIdentity(nameValue: unknown, phoneValue: unknown) {
  const name = String(nameValue || "").trim();
  const phone = normalizePhone(phoneValue);
  if (name.length < 1 || name.length > 40) throw new Error("이름을 확인해주세요.");
  if (!/^01[0-9]{8,9}$/.test(phone)) throw new Error("휴대폰 번호를 확인해주세요.");
  return { name, phone };
}

function signature(memberId: number) {
  const secret = sessionSecret();
  return secret ? createHmac("sha256", secret).update(`member:${memberId}`).digest("hex") : null;
}

export function memberCookie(memberId: number) {
  const signed = signature(memberId);
  if (!signed) return null;
  return { name: COOKIE_NAME, value: `${memberId}.${signed}`, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 };
}

export function clearMemberCookie() {
  return { name: COOKIE_NAME, value: "", httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 };
}

function memberIdFromToken(token: string | undefined) {
  if (!token) return null;
  const [idText, actual] = token.split(".");
  const memberId = Number(idText);
  if (!Number.isSafeInteger(memberId) || !actual) return null;
  const expected = signature(memberId);
  if (!expected) return null;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  return memberId;
}

export async function getCurrentMember() {
  if (!sessionSecret()) return null;
  const db = getDb();
  if (!db) return null;
  const store = await cookies();
  const memberId = memberIdFromToken(store.get(COOKIE_NAME)?.value);
  if (!memberId) return null;
  const rows = await db.select().from(members).where(eq(members.id, memberId)).limit(1);
  return rows[0] || null;
}

export function publicMember(member: typeof members.$inferSelect) {
  return { id: member.id, name: member.name, phone: member.phone, recipientName: member.recipientName, recipientPhone: member.recipientPhone, postalCode: member.postalCode, address: member.address, detailAddress: member.detailAddress, deliveryNote: member.deliveryNote };
}

export { COOKIE_NAME };
