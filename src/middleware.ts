import { NextRequest, NextResponse } from "next/server";

const apiHits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = apiHits.get(ip);

  if (!entry || now > entry.resetAt) {
    apiHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasSession = /better-auth\.session_token=/.test(cookieHeader);

  const isApiRoute = pathname.startsWith("/api/admin");

  if (isApiRoute) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    if (rateLimit(ip)) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }

  if (!hasSession) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
