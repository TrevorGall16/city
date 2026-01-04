/**
 * 🛰️ MASTER AI: NETLIFY EDGE LOCALIZER (V1.0)
 * ✅ Performance: Runs at the edge (zero-latency redirects).
 * ✅ Fix: Replaces the deprecated Next.js middleware convention.
 * ✅ Logic: Full browser language detection for all 9 languages.
 */

import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];
  const defaultLocale = 'en';

  // 1. Skip if the path already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // 2. Skip for static assets (Images, Favicons, etc.)
  const excludedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webmanifest", ".js", ".css"];
  if (excludedExtensions.some(ext => url.pathname.endsWith(ext))) return;

  // 3. Detect Browser Language
  const acceptLanguage = request.headers.get("accept-language");
  let locale = defaultLocale;

  if (acceptLanguage) {
    const detected = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].split("-")[0].toLowerCase())
      .find((lang) => locales.includes(lang));
    if (detected) locale = detected;
  }

  // 4. Perform the "Proxy" Redirect
  const redirectUrl = new URL(`/${locale}${url.pathname}`, request.url);
  return Response.redirect(redirectUrl.toString(), 302);
};

export const config = { path: "/*" };