import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Stateless admin sessions. No database: the browser holds
// `user.expiry.signature` (HMAC-SHA256 keyed by the salt in admin.json).
// Rotating credentials issues a new salt, which invalidates old cookies.

export const SESSION_COOKIE = "antigane_admin";
export const SESSION_TTL_MS = 7 * 24 * 3600 * 1000;

export function hashPassword(salt: string, user: string, pass: string): string {
  return createHash("sha256").update(`${salt}:${user}:${pass}`).digest("hex");
}

export function verifyPassword(salt: string, expectedHash: string, user: string, pass: string): boolean {
  const digest = Buffer.from(hashPassword(salt, user, pass), "utf-8");
  const expected = Buffer.from(expectedHash, "utf-8");
  return digest.length === expected.length && timingSafeEqual(digest, expected);
}

export function createSession(user: string, salt: string): string {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", salt).update(`${user}.${expiry}`).digest("hex");
  return `${user}.${expiry}.${sig}`;
}

export function verifySession(raw: string, user: string, salt: string): boolean {
  if (!user || !salt) return false;
  const [u, expiry, sig] = raw.split(".");
  if (!u || !expiry || !sig || u !== user) return false;
  if (!/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false;
  const expected = createHmac("sha256", salt).update(`${u}.${expiry}`).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(sig, "hex");
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
