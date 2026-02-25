import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  const { data: { session } } = await supabase.auth.getSession()

  const profileMatch = request.nextUrl.pathname.match(/^\/([^/]+)\/profile(\/|$)/)
  if (profileMatch && !session) {
    const lang = profileMatch[1]
    return NextResponse.redirect(new URL(`/${lang}/sign-in`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/:lang/profile', '/:lang/profile/:path*'],
}
