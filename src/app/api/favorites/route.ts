import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ============================================================================
// GET Handler:
//   - When placeSlug + citySlug are present: return { isSaved }
//   - When citySlug only is present: return that user's saved place_slugs in
//     that city, used by CityPlacesSection.
//   - When neither is present: return the user's full saved_places list,
//     used by the favorites index page and the public profile page.
// ============================================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placeSlug = searchParams.get('placeSlug')
    const citySlug = searchParams.get('citySlug')

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      if (placeSlug && citySlug) {
        return NextResponse.json({ isSaved: false })
      }
      return NextResponse.json({ items: [] })
    }

    if (placeSlug && citySlug) {
      const { data, error } = await supabase
        .from('saved_places')
        .select('id')
        .eq('user_id', user.id)
        .eq('place_slug', placeSlug)
        .eq('city_slug', citySlug)
        .maybeSingle()

      if (error) {
        console.error('GET favorites (single) error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ isSaved: !!data })
    }

    let listQuery = supabase
      .from('saved_places')
      .select('id, place_slug, city_slug, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (citySlug) {
      listQuery = listQuery.eq('city_slug', citySlug)
    }

    const { data: items, error: listError } = await listQuery

    if (listError) {
      console.error('GET favorites (list) error:', listError)
      return NextResponse.json({ error: listError.message }, { status: 500 })
    }

    return NextResponse.json({ items: items ?? [] })
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
