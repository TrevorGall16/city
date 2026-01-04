/**
 * 🛰️ MASTER AI: GLOBAL MIDDLEWARE (V6.5 - SEO REPAIR)
 * ✅ Fixed: Excluded sitemap.xml and robots.txt from redirects.
 * ✅ Fixed: Resolved NextRequest import for Next.js 16.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; 

const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const detected = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].split("-")[0].toLowerCase())
    .find((lang) => locales.includes(lang));

  return detected || defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ 1. Immediate Safety Check: Allow SEO files to be served from root
  if (
    pathname === '/sitemap.xml' || 
    pathname === '/robots.txt' || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. Check if the path already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 3. Redirect if locale is missing
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // 🎯 MASTER AI MATCHER: Explicitly exclude static assets and SEO files
    '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|sw.js).*)',
  ],
};