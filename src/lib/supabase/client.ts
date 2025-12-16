// @/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// The URL and anonymous key are safe to be public
// Next.js will replace these environment variables at build time
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}