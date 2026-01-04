/**
 * 🛰️ MASTER AI: GLOBAL PROXY (V8.1 - SITEMAP BYPASS)
 * ✅ Feature: Prevents language redirects on SEO & Static files.
 * ✅ Fix: Strictly excludes sitemap.xml from any language redirect.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; 

const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ MASTER AI SEO LOCK:
  // If the path is a system file, STOP and let it load from the root.
  if (
    pathname === '/sitemap.xml' || 
    pathname === '/robots.txt' || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') // Bypasses all files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if the path already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to language folder ONLY for actual pages (e.g., /city/paris -> /fr/city/paris)
  const acceptLanguage = request.headers.get("accept-language");
  const detected = acceptLanguage
    ?.split(",")
    .map((lang) => lang.split(";")[0].split("-")[0].toLowerCase())
    .find((lang) => locales.includes(lang)) || defaultLocale;

  const redirectUrl = new URL(`/${detected}${pathname}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * 🎯 MASTER AI MATCHER:
     * Exclude API, Static, Images, and specifically sitemap.xml
     */
    '/((?!api|_next|images|sitemap\\.xml|robots\\.txt|favicon\\.ico).*)',
  ],
};