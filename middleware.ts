import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET;
  const role = token && secret ? await verifySessionToken(token, secret) : null;

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("x-session-role", role);
  return response;
}

export const config = {
  matcher: [
    "/((?!api/gate|gate|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|ico)$).*)",
  ],
};
