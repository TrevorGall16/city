/**
 * 🛰️ MASTER AI: GLOBAL PROXY (V9.0 - AUTH & SEO)
 * ✅ Feature: Manages Supabase Auth sessions (Fixes login loop).
 * ✅ Feature: Handles Language Redirects.
 * ✅ Safety: Protects sitemap.xml and static files.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
const defaultLocale = 'en';

export async function proxy(request: NextRequest) {
  // 1. Initialize Response (We use a let variable so Supabase can update it)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize Supabase Client
  // This is critical to "catch" the login cookie from the Callback
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update the request cookies so they are available immediately
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Update the response object (re-creating it to persist headers)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 3. Refresh Session
  // This checks if the user is logged in and refreshes the token if needed.
  await supabase.auth.getUser()

  // --- 🛡️ LOGIC START ---
  const { pathname } = request.nextUrl;

  // 4. SEO & SYSTEM LOCK
  // If the path is a system file, STOP and return the response (with auth cookies)
  if (
    pathname === '/sitemap.xml' || 
    pathname === '/robots.txt' || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return response;
  }

  // 5. Check if the path already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return response;
  }

  // 6. Redirect Logic (If locale is missing)
  const acceptLanguage = request.headers.get("accept-language");
  const detected = acceptLanguage
    ?.split(",")
    .map((lang) => lang.split(";")[0].split("-")[0].toLowerCase())
    .find((lang) => locales.includes(lang)) || defaultLocale;

  const redirectUrl = new URL(`/${detected}${pathname}`, request.url);
  const redirectResponse = NextResponse.redirect(redirectUrl);

  // 🎯 CRITICAL: Copy Supabase cookies to the Redirect Response
  // If we don't do this, the "Login" cookie gets lost during the redirect to /fr/
  const supabaseCookies = response.cookies.getAll();
  supabaseCookies.forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return redirectResponse;
}

export const config = {
  matcher: [
    /*
     * 🎯 MASTER AI WHITELIST:
     * Only run on root, languages, and city pages.
     * This AUTOMATICALLY ignores sitemap.xml
     */
    '/',
    '/(en|fr|es|it|ja|hi|de|zh|ar)/:path*',
    '/city/:path*',
    '/about', '/contact', '/privacy', '/terms'
  ],
};