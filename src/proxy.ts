/**
 * Edge proxy: locale routing + Supabase session refresh.
 *
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` and the exported function
 * from `middleware` to `proxy`. Behavior is identical.
 *
 * Responsibilities (in order):
 *   1. Initialize a Supabase server client bound to the request/response cookies.
 *   2. Call `getUser()` so the Supabase SDK can rotate the access token
 *      and write fresh cookies onto `response` if it expired.
 *   3. Short-circuit for paths that already include a locale prefix.
 *   4. Otherwise detect a locale from Accept-Language and redirect, copying
 *      any cookies Supabase just rotated onto the redirect response so the
 *      session is not lost across the locale hop.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/data/locales'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Triggers token refresh if needed; rotated cookies land on `response`
  // via the setAll adapter above.
  await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const pathnameHasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )

  if (pathnameHasLocale) {
    return response
  }

  const acceptLanguage = request.headers.get('accept-language')
  const detected =
    acceptLanguage
      ?.split(',')
      .map((lang) => lang.split(';')[0].split('-')[0].toLowerCase())
      .find((lang) => (LOCALES as readonly string[]).includes(lang)) ||
    DEFAULT_LOCALE

  const targetPath =
    pathname === '/' ? `/${detected}` : `/${detected}${pathname}`
  const redirectResponse = NextResponse.redirect(
    new URL(targetPath, request.url)
  )

  // Propagate Supabase auth cookies to the redirect so login state
  // survives the locale hop.
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return redirectResponse
}

export const config = {
  /**
   * Negative matcher — runs on everything EXCEPT:
   *   - /api/*           (route handlers manage their own auth)
   *   - /_next/*         (build/static internals)
   *   - /auth/callback   (manages its own cookie store)
   *   - anything with a file extension (sitemap.xml, robots.txt, images, etc.)
   */
  matcher: ['/((?!api/|_next/|auth/callback|.*\\..*).*)'],
}
