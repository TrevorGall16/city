import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// 🛡️ Validation Schema
const ReportSchema = z.object({
  commentId: z.string().uuid('Invalid comment ID'),
  reason: z.string().min(1, 'Reason required').max(500, 'Too long').trim(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Rate Limit (Uses your src/lib/rate-limit.ts)
    // Note: We check 'comment_reports' table
    const isRateLimited = await checkRateLimit(supabase, user.id, 'comment_reports', RATE_LIMITS.REPORT)
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'You are reporting too frequently. Please wait.' },
        { status: 429 }
      )
    }

    // 3. Validation
    const body = await request.json()
    const validation = ReportSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { commentId, reason } = validation.data

    // 4. Submit Report
    const { data, error } = await supabase
      .from('comment_reports')
      .insert({
        comment_id: commentId,
        reporter_id: user.id,
        reason,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      // Handle "Already reported" case gracefully
      if (error.code === '23505') {
        return NextResponse.json({ error: 'You have already reported this comment' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ success: true, message: 'Report submitted' })

  } catch (error: any) {
    console.error('Report Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}