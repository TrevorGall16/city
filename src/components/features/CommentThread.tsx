'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LoginModal } from '@/components/ui/LoginModal'
import { Trash2, ThumbsUp, ThumbsDown } from 'lucide-react'

interface Profile {
  display_name: string | null
  avatar_url: string | null
}

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: Profile // Made optional for safety
  votes?: { value: number }[]
  vote_count?: number
  user_vote?: number
}

interface CommentThreadProps {
  citySlug: string
  placeSlug?: string // Optional: if null, it's a city-level comment
}

export function CommentThread({ citySlug, placeSlug }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // 1. Check User Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // 2. Fetch Comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true)
      let url = `/api/comments?citySlug=${citySlug}`
      if (placeSlug) url += `&placeSlug=${placeSlug}`

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }, [citySlug, placeSlug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          citySlug,
          placeSlug,
        }),
      })

      const text = await res.text() // Get raw text first to debug
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`API returned invalid JSON: ${text.substring(0, 50)}...`)
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment')
      }

      // Optimistically add the comment (Safety check added here)
      if (data) {
        setComments((prev) => [data, ...prev])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // 4. Handle Delete
  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span>💬</span> Community Tips
      </h3>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Share your tip..." : "Sign in to share your tip..."}
          className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px] resize-y mb-3"
          disabled={!user || submitting}
        />
        <div className="flex justify-end">
          <button
            type={user ? "submit" : "button"}
            onClick={!user ? () => setShowLoginModal(true) : undefined}
            disabled={user ? (!newComment.trim() || submitting) : false}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {user ? (submitting ? 'Posting...' : 'Post Comment') : 'Sign In to Comment'}
          </button>
        </div>
      </form>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Comment List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-slate-500 text-center py-4">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-slate-400 text-center py-4 italic">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => {
            // SAFETY CHECK: If comment is null/undefined, skip it
            if (!comment) return null;

            return (
              <div key={comment.id} className="flex gap-4 group">
                {/* Avatar with fallback */}
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden text-sm font-bold text-slate-500">
                  {comment.profiles?.avatar_url ? (
                    <img 
                      src={comment.profiles.avatar_url} 
                      alt={comment.profiles.display_name || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (comment.profiles?.display_name?.[0] || '?').toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-semibold text-slate-900">
                      {comment.profiles?.display_name || 'Traveler'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3">
                    {/* Only show delete if user owns comment */}
                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}