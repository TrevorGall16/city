'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CommentItem } from '@/components/features/CommentItem'
import { toast } from 'sonner'
import { MessageCircle, Loader2, Send } from 'lucide-react'

interface CommentThreadProps {
  citySlug: string
  placeSlug?: string
}

export function CommentThread({ citySlug, placeSlug }: CommentThreadProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()

  // 1. Fetch User & Comments on Mount
  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const url = new URL('/api/comments', window.location.origin)
      url.searchParams.set('citySlug', citySlug)
      if (placeSlug) url.searchParams.set('placeSlug', placeSlug)
      
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [citySlug, placeSlug, supabase.auth])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 2. Handler: Post a Top-Level Comment
  const handlePostComment = async () => {
    if (!user) {
      toast.error('Please log in to comment')
      return
    }
    if (!newComment.trim()) return

    setIsPosting(true)
    try {
      const { error } = await supabase.from('comments').insert({
        content: newComment,
        city_slug: citySlug,
        place_slug: placeSlug || null,
        user_id: user.id
      })

      if (error) throw error

      setNewComment('')
      toast.success('Comment posted!')
      fetchData() // Refresh list
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setIsPosting(false)
    }
  }

  // 3. Handlers passed down to Items
const handleVote = async (commentId: string, value: number) => {
  if (!user) {
    toast.error('Please log in to vote')
    return // ✅ Returns void (undefined)
  }
    
    // Optimistic UI Update
    setComments(prev => updateVoteInTree(prev, commentId, value))

    try {
      await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({ commentId, value })
      })
    } catch {
      toast.error('Failed to vote')
      fetchData() // Revert on error
    }
  }

  const handleEdit = async (commentId: string, newContent: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        body: JSON.stringify({ commentId, content: newContent })
      })
      if (!res.ok) throw new Error('Failed to update')
      
      // Update local state immediately (showing "edited")
      setComments(prev => updateContentInTree(prev, commentId, newContent))
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to edit')
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error
      
      setComments(prev => removeCommentFromTree(prev, commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleReport = async (commentId: string) => {
    if (!user) return toast.error('Please log in to report')
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify({ commentId, reason: 'User reported content' })
      })
      if (res.status === 409) return toast.error('You already reported this')
      if (!res.ok) throw new Error()
      toast.success('Thank you for keeping our community safe')
    } catch {
      toast.error('Failed to report')
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Share your tip..." : "Log in to share a tip..."}
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-xs text-slate-400">Be helpful and kind.</p>
          <button
            onClick={handlePostComment}
            disabled={isPosting || !newComment.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Post
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No tips yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              onVote={handleVote}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          ))
        )}
      </div>
    </div>
  )
}

// --- HELPER FUNCTIONS FOR TREE UPDATES ---

function updateVoteInTree(list: any[], id: string, delta: number): any[] {
  return list.map(c => {
    if (c.id === id) {
      const currentVote = c.user_vote || 0
      // If clicking same vote (toggle off) -> remove vote
      // If clicking different vote -> switch vote (delta * 2 effectively, but logic simplifies to just setting new state)
      // For simplicity in optimistic UI, we usually just assume the backend handles the exact math, 
      // but here we just increment visual count to feel snappy.
      return { ...c, vote_count: c.vote_count + delta, user_vote: delta } 
    }
    if (c.replies?.length) return { ...c, replies: updateVoteInTree(c.replies, id, delta) }
    return c
  })
}

function updateContentInTree(list: any[], id: string, content: string): any[] {
  return list.map(c => {
    if (c.id === id) return { ...c, content, updated_at: new Date().toISOString() }
    if (c.replies?.length) return { ...c, replies: updateContentInTree(c.replies, id, content) }
    return c
  })
}

function removeCommentFromTree(list: any[], id: string): any[] {
  return list.filter(c => c.id !== id).map(c => ({
    ...c,
    replies: c.replies ? removeCommentFromTree(c.replies, id) : []
  }))
}