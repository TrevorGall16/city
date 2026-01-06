/**
 * Rate Limiter Utility
 * Database-based rate limiting for API routes
 * Prevents spam and abuse by limiting actions per user per time window
 */

type SupabaseClient = any

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests allowed in window
}

/**
 * Check if user has exceeded rate limit
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @param table - Table name to check (e.g., 'comments', 'votes')
 * @param config - Rate limit configuration
 * @returns true if rate limited, false if allowed
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  table: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 1 }
): Promise<boolean> {
  const windowStart = new Date(Date.now() - config.windowMs).toISOString()

  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart)

  // If DB check fails, let it pass to avoid blocking valid users
  if (error) {
    console.error(`Rate limit check error for table ${table}:`, error)
    return false
  }

  // If user has exceeded max requests in window -> BLOCK
  return count !== null && count >= config.maxRequests
}

/**
 * Preset configurations for different endpoints
 */
export const RATE_LIMITS = {
  COMMENT: { windowMs: 60000, maxRequests: 1 }, // 1 per minute
  VOTE: { windowMs: 5000, maxRequests: 10 }, // 10 per 5 seconds
  REPORT: { windowMs: 300000, maxRequests: 5 }, // 5 per 5 minutes
} as const
