import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ============================================================================
// POST Handler: Submit a comment report
// ============================================================================
export async function POST(request: Request) {
  try {
const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to report comments.' }, { status: 401 })
    }

    const body = await request.json()
    const { commentId, reason } = body

    if (!commentId || !reason) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Verify comment exists
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('id')
      .eq('id', commentId)
      .single()

    if (commentError || !comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Insert report (will fail if duplicate due to UNIQUE constraint)
    const { data, error: insertError } = await supabase
      .from('comment_reports')
      .insert({
        comment_id: commentId,
        reporter_id: user.id,
        reason,
        status: 'pending',
      })
      .select('*')
      .single()

    if (insertError) {
      // Check if duplicate report
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already reported this comment' },
          { status: 409 }
        )
      }
      console.error('Insert report error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      data
    })

  } catch (err: any) {
    console.error('POST /api/reports error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
