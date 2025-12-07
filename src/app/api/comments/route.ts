import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore inside Server Component
            }
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, citySlug, placeSlug } = body

    if (!content || !citySlug) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // --- THE FIX IS HERE ---
    // We select '*, profiles(*)' to get the Author info immediately
    const { data, error: dbError } = await supabase
      .from('comments')
      .insert({
        content,
        city_slug: citySlug,
        place_slug: placeSlug || null,
        user_id: user.id
      })
      .select('*, profiles(*)') // <--- CRITICAL CHANGE
      .single()

    if (dbError) {
      console.error('DB ERROR:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (err: any) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}