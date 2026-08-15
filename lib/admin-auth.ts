import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "rhinory_admin_session";

function effectiveSecret() {
  return process.env.ADMIN_ACCESS_KEY || (process.env.NODE_ENV !== "production" ? "demo-admin-local-only" : null);
}

function sessionToken() {
  const secret = effectiveSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update("rhinory-admin-session-v1").digest("hex");
}

export function isValidAdminKey(value: string) {
  const secret = process.env.ADMIN_ACCESS_KEY || (process.env.NODE_ENV !== "production" ? "demo-admin" : null);
  if (!secret || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthorized() {
  const expected = sessionToken();
  if (!expected) return false;
  const store = await cookies();
  const actual = store.get(COOKIE_NAME)?.value;
  if (!actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function adminCookie() {
  const token = sessionToken();
  if (!token) return null;
  return { name: COOKIE_NAME, value: token };
}

export { COOKIE_NAME };
