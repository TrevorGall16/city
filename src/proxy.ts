/**
 * 🛰️ MASTER AI: GLOBAL PROXY (V8.0 - NEXT.JS 16 COMPLIANT)
 * ✅ Feature: Prevents language redirects on SEO & Static files.
 * ✅ Fixed: Direct root access for sitemap.xml and robots.txt.
 * ✅ Updated: Function name changed to 'proxy' for Next.js 16 standards.
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

// 🎯 MASTER AI FIX: Changed from 'export function middleware' to 'export function proxy'
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ 1. MASTER AI ROOT LOCK: 
  if (
    pathname === '/sitemap.xml' || 
    pathname === '/sitemap_index.xml' || 
    pathname === '/robots.txt' || 
    pathname === '/favicon.ico' ||
    pathname === '/sitemap' || 
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') 
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
     * 🛰️ MASTER AI: EMERGENCY SIMPLIFIED MATCHER
     * Exclude ANYTHING with a file extension (contains a dot)
     */
    '/((?!api|_next|images|.*\\..*).*)', 
  ],
};