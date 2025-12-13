import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ============================================================================
// GET Handler: Fetch comments with threading and pagination
// ============================================================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const citySlug = searchParams.get('citySlug')
    const placeSlug = searchParams.get('placeSlug')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!citySlug) {
      return NextResponse.json({ error: 'citySlug is required' }, { status: 400 })
    }

const supabase = await createClient()

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser()

    // Build query for comments
    let query = supabase
      .from('comments')
      .select(`
        *,
        profiles (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('city_slug', citySlug)
      .order('vote_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by place_slug if provided
    if (placeSlug) {
      query = query.eq('place_slug', placeSlug)
    } else {
      query = query.is('place_slug', null)
    }

    const { data: comments, error: commentsError } = await query

    if (commentsError) {
      console.error('Comments fetch error:', commentsError)
      return NextResponse.json({ error: commentsError.message }, { status: 500 })
    }

    // If user is authenticated, fetch their votes for these comments
    let userVotes: { [key: string]: number } = {}
    if (user && comments && comments.length > 0) {
      const commentIds = comments.map((c: any) => c.id)
      const { data: votes } = await supabase
        .from('votes')
        .select('comment_id, value')
        .eq('user_id', user.id)
        .in('comment_id', commentIds)

      if (votes) {
        userVotes = votes.reduce((acc: any, vote: any) => {
          acc[vote.comment_id] = vote.value
          return acc
        }, {})
      }
    }

    // Attach user_vote to each comment
    const commentsWithVotes = comments?.map((comment: any) => ({
      ...comment,
      user_vote: userVotes[comment.id] || 0,
    }))

    // Build tree structure (nested replies)
    const commentTree = buildCommentTree(commentsWithVotes || [])

    return NextResponse.json({
      comments: commentTree,
      hasMore: comments && comments.length === limit,
    })

  } catch (err: any) {
    console.error('GET /api/comments error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================================
// POST Handler: Create new comment (with optional parent_id for replies)
// ============================================================================
export async function POST(request: Request) {
  try {
const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, citySlug, placeSlug, parentId } = body

    if (!content || !citySlug) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Validate parent_id exists if provided
    if (parentId) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parentId)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 400 })
      }
    }

    // Insert comment with optional parent_id
    const { data, error: dbError } = await supabase
      .from('comments')
      .insert({
        content,
        city_slug: citySlug,
        place_slug: placeSlug || null,
        parent_id: parentId || null,
        user_id: user.id
      })
      .select('*, profiles(*)')
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

// ============================================================================
// PATCH Handler: Edit existing comment
// ============================================================================
export async function PATCH(request: Request) {
  try {
const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { commentId, content } = body

    if (!commentId || !content) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Verify user owns the comment
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (fetchError || !existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json({ error: 'You can only edit your own comments' }, { status: 403 })
    }

    // Update comment
    const { data, error: updateError } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json(data)

  } catch (err: any) {
    console.error('PATCH /api/comments error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ============================================================================
// Helper Function: Build comment tree structure
// Takes flat array of comments and returns nested tree based on parent_id
// ============================================================================
interface Comment {
  id: string
  parent_id: string | null
  [key: string]: any
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}

function buildCommentTree(flatComments: Comment[]): CommentWithReplies[] {
  // Create a map for quick lookup
  const commentMap = new Map<string, CommentWithReplies>()
  const rootComments: CommentWithReplies[] = []

  // First pass: Initialize all comments with empty replies array
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Second pass: Build tree structure
  flatComments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!

    if (comment.parent_id === null) {
      // Top-level comment
      rootComments.push(commentWithReplies)
    } else {
      // Reply to another comment
      const parent = commentMap.get(comment.parent_id)
      if (parent) {
        parent.replies.push(commentWithReplies)
      } else {
        // Parent not in current batch, treat as root
        rootComments.push(commentWithReplies)
      }
    }
  })

  // Sort replies by vote_count and created_at (recursively)
  const sortReplies = (comments: CommentWithReplies[]) => {
    comments.sort((a, b) => {
      // Primary sort: vote_count descending
      if (b.vote_count !== a.vote_count) {
        return b.vote_count - a.vote_count
      }
      // Secondary sort: created_at descending (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    // Recursively sort nested replies
    comments.forEach((comment) => {
      if (comment.replies.length > 0) {
        sortReplies(comment.replies)
      }
    })
  }

  sortReplies(rootComments)

  return rootComments
}