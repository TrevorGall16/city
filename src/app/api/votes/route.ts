/**
 * Votes API Route
 * POST: Upvote/downvote a comment (or remove vote)
 *
 * CRITICAL: No anonymous writes - auth required
 * Uses atomic upsert_vote function for race condition safety
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    const { commentId, value } = body

    // Validate input
    if (!commentId) {
      return NextResponse.json(
        { error: 'commentId is required' },
        { status: 400 }
      )
    }

    if (![1, 0, -1].includes(value)) {
      return NextResponse.json(
        { error: 'value must be -1, 0, or 1' },
        { status: 400 }
      )
    }

    // Use atomic upsert function
    const { error } = await supabase.rpc('upsert_vote', {
      p_comment_id: commentId,
      p_user_id: user.id,
      p_value: value,
    })

    if (error) {
      console.error('Error upserting vote:', error)
      return NextResponse.json(
        { error: 'Failed to update vote' },
        { status: 500 }
      )
    }

    // Get updated vote count
    const { data: voteCount } = await supabase.rpc('get_comment_score', {
      comment_uuid: commentId,
    })

    return NextResponse.json({
      success: true,
      vote_count: voteCount || 0,
      user_vote: value,
    })
  } catch (error) {
    console.error('Unexpected error in POST /api/votes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
