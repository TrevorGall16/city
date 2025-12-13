import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ============================================================================
// GET Handler: Check if a place is saved
// ============================================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placeSlug = searchParams.get('placeSlug')
    const citySlug = searchParams.get('citySlug')

    if (!placeSlug || !citySlug) {
      return NextResponse.json(
        { error: 'placeSlug and citySlug are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Not authenticated - return unsaved
      return NextResponse.json({ isSaved: false })
    }

    // Check if saved
    const { data, error } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_slug', placeSlug)
      .eq('city_slug', citySlug)
      .maybeSingle()

    if (error) {
      console.error('GET favorites error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ isSaved: !!data })

  } catch (err: any) {
    console.error('GET /api/favorites error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================================
// POST Handler: Toggle save status (delete if exists, insert if missing)
// ============================================================================
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to save places.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { placeSlug, citySlug } = body

    if (!placeSlug || !citySlug) {
      return NextResponse.json(
        { error: 'placeSlug and citySlug are required' },
        { status: 400 }
      )
    }

    // Check if already saved
    const { data: existing, error: checkError } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_slug', placeSlug)
      .eq('city_slug', citySlug)
      .maybeSingle()

    if (checkError) {
      console.error('Check existing error:', checkError)
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existing) {
      // Already saved - DELETE it (unsave)
      const { error: deleteError } = await supabase
        .from('saved_places')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        console.error('Delete error:', deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        isSaved: false,
        message: 'Place removed from saved'
      })
    } else {
      // Not saved - INSERT it (save)
      const { data, error: insertError } = await supabase
        .from('saved_places')
        .insert({
          user_id: user.id,
          place_slug: placeSlug,
          city_slug: citySlug,
        })
        .select('*')
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        isSaved: true,
        message: 'Place saved',
        data
      })
    }

  } catch (err: any) {
    console.error('POST /api/favorites error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
