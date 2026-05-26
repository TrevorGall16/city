/**
 * Centralized rate limiter backed by the `rate_limit_attempts` ledger.
 *
 * Why a DB ledger and not an in-memory cache?
 *   - The app is deployed to Netlify, which runs each API route in a
 *     short-lived serverless function. In-memory state is wiped between
 *     concurrent invocations, so an in-memory token bucket cannot enforce
 *     limits across distributed handlers.
 *   - A Postgres ledger gives us a single source of truth that survives
 *     cold starts and is consistent across regions.
 *
 * The previous implementation counted rows in the target table (comments,
 * votes, ...). That approach broke when a user hadn't yet committed any
 * rows, and it conflated rate-limit state with content state. This module
 * replaces it.
 */

type SupabaseClient = any

export type RateLimitAction =
  | 'comments'
  | 'votes'
  | 'reports'
  | 'favorites'

export interface RateLimitConfig {
  /** Time window in milliseconds. */
  windowMs: number
  /** Maximum attempts allowed inside the window. */
  maxRequests: number
}

/**
 * Returns `true` if the user has exceeded the configured limit for `action`
 * within `config.windowMs`, otherwise `false` and records a new attempt.
 *
 * Fail-open: if the DB lookup itself errors we let the request through
 * rather than block legitimate users.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  action: RateLimitAction | string,
  config: RateLimitConfig = { windowMs: 60_000, maxRequests: 1 }
): Promise<boolean> {
  const windowStart = new Date(Date.now() - config.windowMs).toISOString()

  const { count, error: countError } = await supabase
    .from('rate_limit_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('action', action)
    .gte('created_at', windowStart)

  if (countError) {
    console.error(
      `rate-limit: count error for action "${action}":`,
      countError
    )
    return false
  }

  if (count !== null && count >= config.maxRequests) {
    return true
  }

  const { error: insertError } = await supabase
    .from('rate_limit_attempts')
    .insert({ user_id: userId, action })

  if (insertError) {
    console.error(
      `rate-limit: insert error for action "${action}":`,
      insertError
    )
  }

  return false
}

/**
 * Preset configurations.
 *
 * VOTE is intentionally tight (2 req/s) because vote-button mashing is the
 * most common abuse vector and there is no UX reason to vote faster than
 * twice per second.
 */
export const RATE_LIMITS = {
  COMMENT: { windowMs: 60_000, maxRequests: 1 }, // 1 per minute
  VOTE: { windowMs: 1_000, maxRequests: 2 }, // 2 per second
  REPORT: { windowMs: 300_000, maxRequests: 5 }, // 5 per 5 minutes
  FAVORITE: { windowMs: 5_000, maxRequests: 5 }, // 5 per 5 seconds
} as const
