'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CommentItem } from '@/components/features/CommentItem'
import { toast } from 'sonner'
import { MessageCircle, Loader2, Send } from 'lucide-react'

interface CommentThreadProps {
  citySlug: string
  placeSlug?: string
  lang: string
  dict: any
}

export function CommentThread({ citySlug, placeSlug, lang, dict }: CommentThreadProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()

  // ✅ SAFETY FALLBACK: If dict is undefined, use an empty object to prevent crashing
  const d = dict || {}

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

  useEffect(() => { fetchData() }, [fetchData])

  const handlePostComment = async () => {
    if (!user) {
      toast.error(d.login_to_comment || 'Please log in to comment')
      return
    }
    const trimmed = newComment.trim()
    if (!trimmed) return
    if (trimmed.length > 500) {
      toast.error('Comment is too long (max 500 chars)')
      return
    }
    setIsPosting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: trimmed,
          citySlug,
          placeSlug: placeSlug || null,
        }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to post comment')
      }
      setNewComment('')
      toast.success('Comment posted!')
      fetchData()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post comment')
    } finally {
      setIsPosting(false)
    }
  }

  const handleVote = async (commentId: string, value: number) => {
    if (!user) {
      toast.error(d.login_to_comment || 'Please log in to vote')
      return
    }
    setComments(prev => updateVoteInTree(prev, commentId, value))
    try {
      await fetch('/api/votes', { method: 'POST', body: JSON.stringify({ commentId, value }) })
    } catch {
      fetchData()
    }
  }

  const handleEdit = async (commentId: string, newContent: string) => {
    const trimmed = newContent.trim()
    if (!trimmed) return
    if (trimmed.length > 500) {
      toast.error('Comment is too long (max 500 chars)')
      return
    }
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, content: trimmed }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setComments(prev => updateContentInTree(prev, commentId, trimmed))
      toast.success('Comment updated')
    } catch { toast.error('Failed to edit') }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure?')) return
    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.error || 'Failed to delete')
      }
      setComments(prev => removeCommentFromTree(prev, commentId))
      toast.success('Comment deleted')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete')
    }
  }

  const handleReport = async (commentId: string) => {
    if (!user) return toast.error(d.login_to_comment || 'Please log in to report')
    try {
      const res = await fetch('/api/reports', { method: 'POST', body: JSON.stringify({ commentId, reason: 'Reported' }) })
      if (res.status === 409) return toast.error('Already reported')
      if (!res.ok) throw new Error()
      toast.success('Reported')
    } catch { toast.error('Failed to report') }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          // ✅ Defensive checks using the 'd' constant
          placeholder={user ? (d.share_tip_placeholder || "Share a tip...") : (d.login_to_comment || "Log in to comment")}
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          <p className="text-xs text-slate-400">{d.be_kind || "Be kind and helpful."}</p>
          <button onClick={handlePostComment} disabled={isPosting || !newComment.trim()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {d.post_button || "Post"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={user?.id}
            lang={lang}
            dict={d}
            onVote={handleVote}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
      </div>
    </div>
  )
}

// --- HELPER FUNCTIONS ---
function updateVoteInTree(list: any[], id: string, delta: number): any[] {
  return list.map(c => {
    if (c.id === id) return { ...c, vote_count: c.vote_count + delta, user_vote: delta } 
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