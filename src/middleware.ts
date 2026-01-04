/**
 * 🛰️ MASTER AI: GLOBAL MIDDLEWARE (V7.0 - ULTIMATE SEO LOCK)
 * ✅ Feature: Prevents language redirects on SEO & Static files.
 * ✅ Fixed: Direct root access for sitemap.xml and robots.txt.
 * ✅ Optimization: Protects the /images/ folder from middleware interference.
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

  // 🛡️ 1. MASTER AI ROOT LOCK: 
  // If the path is an image or an SEO file, STOP the middleware immediately.
  // This prevents the redirect to /fr/sitemap.xml or /fr/images/...
  if (
    pathname === '/sitemap.xml' || 
    pathname === '/robots.txt' || 
    pathname === '/favicon.ico' ||
    pathname === '/sitemap' || // Next.js internal alias
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') // Catch-all for any file with an extension (.jpg, .xml, etc)
  ) {
    return NextResponse.next();
  }

  // 2. Check if the path already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 3. Redirect if locale is missing (ONLY for actual pages)
  const locale = getLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * 🎯 MASTER AI MATCHER:
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (local public images)
     * - sitemap.xml, robots.txt, favicon.ico (SEO files)
     */
    '/((?!api|_next|images|sitemap\\.xml|robots\\.txt|favicon\\.ico).*)',
  ],
};