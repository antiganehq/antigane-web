import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import adminCreds from "./messages/admin.json";
import { verifySession } from "./app/admin/session";

const intl = createMiddleware(routing);

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
      // First run: only the login page is reachable; everything else
      // redirects there until an admin registers.
      if (isLogin) return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const signedIn = verifySession(
      request.cookies.get("antigane_admin")?.value ?? "",
      user,
      salt,
    );
    if (isLogin) return NextResponse.next();
    if (!signedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
  return intl(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
