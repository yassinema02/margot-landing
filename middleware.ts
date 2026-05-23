import { NextResponse, type NextRequest } from "next/server";

// Inject an `x-locale` request header that the root layout reads to set
// <html lang>. Keeping it in middleware avoids per-page boilerplate and
// keeps the root layout free of `usePathname` client-side hacks.
//
// Matcher excludes static assets, /api, and Next internals.

const FR_PREFIX = "/fr";

export function middleware(request: NextRequest) {
  const locale = request.nextUrl.pathname === FR_PREFIX || request.nextUrl.pathname.startsWith(`${FR_PREFIX}/`)
    ? "fr"
    : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
