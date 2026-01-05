import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = new Map() // Temporary store for the exchange
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.split('; ').find(c => c.startsWith(`${name}=`))?.split('=')[1]
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, { value, options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set(name, { value: '', options: { ...options, maxAge: 0 } })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create the response object that redirects the user
      const response = NextResponse.redirect(`${origin}${next}`)

      // Apply the cookies from the store to the response
      cookieStore.forEach(({ value, options }, name) => {
        response.cookies.set(name, value, options)
      })

      return response
    }
  }

  // If error, return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}