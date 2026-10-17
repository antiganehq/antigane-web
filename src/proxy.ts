import { NextResponse, type NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import adminCreds from "./messages/admin.json";

const intl = createMiddleware(routing);

function authed(request: NextRequest): boolean {
  const { user, salt, hash } = adminCreds as { user: string; salt: string; hash: string };
  if (!user || !salt || !hash) return false; // unset creds = locked
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return false;
  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf-8");
  } catch {
    return false;
  }
  // decoded is "user:pass" as typed in the browser login box
  const digest = createHash("sha256").update(`${salt}:${decoded}`).digest();
  let expected: Buffer;
  try {
    expected = Buffer.from(hash, "hex");
  } catch {
    return false;
  }
  return digest.length === expected.length && timingSafeEqual(digest, expected);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const { user, salt, hash } = adminCreds as { user: string; salt: string; hash: string };
    const unset = !user || !salt || !hash;
    const isLogin = pathname === "/admin/login";
    if (unset) {
      // First run: only the login page is reachable; everything else stays locked.
      if (isLogin) return NextResponse.next();
      return new Response("Setup required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Antigane Research Admin"' },
      });
    }
    if (isLogin) {
      return NextResponse.redirect(new URL("/admin/research", request.url));
    }
    if (!authed(request)) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Antigane Research Admin"',
        },
      });
    }
    return NextResponse.next();
  }
  return intl(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
