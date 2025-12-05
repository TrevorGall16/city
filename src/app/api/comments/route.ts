/**
 * Comments API Route
 * GET: Fetch comments for a city/place
 * POST: Create new comment
 *
 * CRITICAL: No anonymous writes - auth required for POST
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const citySlug = searchParams.get('citySlug')
    const placeSlug = searchParams.get('placeSlug')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!citySlug) {
      return NextResponse.json(
        { error: 'citySlug is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          display_name,
          avatar_url
        )
      `)
      .eq('city_slug', citySlug)
      .is('parent_id', null) // Only fetch top-level comments
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by place if provided
    if (placeSlug) {
      query = query.eq('place_slug', placeSlug)
    } else {
      query = query.is('place_slug', null)
    }

    const { data: comments, error } = await query

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }

    // Fetch vote counts for each comment
    const commentsWithVotes = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: voteData } = await supabase.rpc('get_comment_score', {
          comment_uuid: comment.id,
        })

        // Get current user's vote if authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser()

        let userVote = 0
        if (user) {
          const { data: userVoteData } = await supabase.rpc('get_user_vote', {
            comment_uuid: comment.id,
            user_uuid: user.id,
          })
          userVote = userVoteData || 0
        }

        // Fetch reply count
        const { count: replyCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('parent_id', comment.id)

        return {
          ...comment,
          vote_count: voteData || 0,
          user_vote: userVote,
          reply_count: replyCount || 0,
        }
      })
    )

    return NextResponse.json({
      comments: commentsWithVotes,
      hasMore: comments ? comments.length === limit : false,
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication - STRICTLY NO ANONYMOUS WRITES
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { citySlug, placeSlug, content, parentId } = body

    // Validate input
    if (!citySlug || !content) {
      return NextResponse.json(
        { error: 'citySlug and content are required' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Insert comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        city_slug: citySlug,
        place_slug: placeSlug || null,
        parent_id: parentId || null,
        content: content.trim(),
      })
      .select(`
        *,
        profiles:user_id (
          display_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      comment: {
        ...comment,
        vote_count: 0,
        user_vote: 0,
        reply_count: 0,
      },
    })
  } catch (error) {
    console.error('Unexpected error in POST /api/comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
