import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// 🛡️ Validation Schema
const VoteSchema = z.object({
  commentId: z.string().uuid(),
  value: z.number().int().min(-1).max(1).refine((val) => [-1, 0, 1].includes(val)),
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
    const isRateLimited = await checkRateLimit(supabase, user.id, 'votes', RATE_LIMITS.VOTE)
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'You are voting too fast. Please slow down.' },
        { status: 429 }
      )
    }

    // 3. Validation
    const body = await request.json()
    const validation = VoteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { commentId, value } = validation.data

    // 4. Perform Vote (Standard Upsert - No RPC needed)
    // This creates or updates the vote safely
    const { error } = await supabase
      .from('votes')
      .upsert(
        { user_id: user.id, comment_id: commentId, value: value },
        { onConflict: 'user_id, comment_id' }
      )

    if (error) throw error

    // 5. Calculate New Score (Simple Sum)
    const { data: scoreData } = await supabase
      .from('votes')
      .select('value')
      .eq('comment_id', commentId)

    const newScore = scoreData?.reduce((acc, curr) => acc + curr.value, 0) || 0

    // 6. Update Comment Cache (Optimization)
    await supabase
      .from('comments')
      .update({ vote_count: newScore })
      .eq('id', commentId)

    return NextResponse.json({
      success: true,
      vote_count: newScore,
      user_vote: value,
    })

  } catch (error: any) {
    console.error('Vote Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}