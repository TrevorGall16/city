/**
 * 🛰️ MASTER AI: GLOBAL MIDDLEWARE (V6.0)
 * ✅ Feature: Auto-detects browser language (Accept-Language).
 * ✅ Optimization: Zero-delay redirects for international users.
 * ✅ Safety: Excludes all static assets and internal Next.js paths.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // 🎯 Change 'request' to 'server'

const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  // Simple parser for browser language headers (e.g., "fr-FR,fr;q=0.9")
  const detected = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].split("-")[0].toLowerCase())
    .find((lang) => locales.includes(lang));

  return detected || defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 2. Redirect if locale is missing (e.g., /city/paris -> /fr/city/paris)
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // 🎯 ADD 'images' and 'public' to the exclusion list below
    '/((?!api|_next/static|_next/image|images|favicon.ico|sw.js).*)',
  ],
};