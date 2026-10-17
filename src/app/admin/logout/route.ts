import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../session";

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", request.url));
  res.cookies.set(SESSION_COOKIE, "", { path: "/admin", maxAge: 0 });
  return res;
}
