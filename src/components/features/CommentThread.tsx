'use client'

/**
 * CommentThread Component
 * Display and manage comments with Load More pattern (NO infinite scroll)
 * Following 06_Quality specification
 */

import { useEffect, useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare, User } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { LoginModal } from '@/components/ui/LoginModal'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { useAnalytics } from '@/hooks/useAnalytics'

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  }
  vote_count: number
  user_vote: number
  reply_count: number
}

interface CommentThreadProps {
  citySlug: string
  placeSlug?: string
}

export function CommentThread({ citySlug, placeSlug }: CommentThreadProps) {
  const { user } = useAuth()
  const { trackCommentPost, trackVote } = useAnalytics()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [votingId, setVotingId] = useState<string | null>(null)

  const LIMIT = 20

  useEffect(() => {
    fetchComments()
  }, [citySlug, placeSlug])

  const fetchComments = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset : 0
      const params = new URLSearchParams({
        citySlug,
        limit: LIMIT.toString(),
        offset: currentOffset.toString(),
      })

      if (placeSlug) {
        params.append('placeSlug', placeSlug)
      }

      const res = await fetch(`/api/comments?${params}`)
      const data = await res.json()

      if (loadMore) {
        setComments((prev) => [...prev, ...(data.comments || [])])
      } else {
        setComments(data.comments || [])
      }

      setHasMore(data.hasMore)
      setOffset(currentOffset + LIMIT)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citySlug,
          placeSlug: placeSlug || null,
          content: newComment.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [data.comment, ...prev])
        setNewComment('')

        // Track analytics
        trackCommentPost(citySlug, placeSlug)
      } else {
        console.error('Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (commentId: string, value: number) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setVotingId(commentId)

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          value,
        }),
      })

      if (res.ok) {
        const data = await res.json()

        // Update comment in state
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, vote_count: data.vote_count, user_vote: data.user_vote }
              : c
          )
        )

        // Track analytics
        trackVote(value, commentId)
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVotingId(null)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-100 h-24 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? 'Share your tip...' : 'Sign in to comment'}
          disabled={!user || submitting}
          className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-50"
          rows={3}
          maxLength={500}
        />
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-slate-500">
            {newComment.length}/500
          </span>
          <Button
            type="submit"
            disabled={!user || !newComment.trim() || submitting}
            variant="primary"
            size="md"
          >
            {submitting ? 'Posting...' : user ? 'Post Comment' : 'Sign In to Comment'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500">No comments yet. Be the first to share a tip!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    {comment.profiles.avatar_url ? (
                      <img
                        src={comment.profiles.avatar_url}
                        alt={comment.profiles.display_name || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">
                        {comment.profiles.display_name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-slate-700 mb-3">{comment.content}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      {/* Upvote */}
                      <button
                        onClick={() =>
                          handleVote(comment.id, comment.user_vote === 1 ? 0 : 1)
                        }
                        disabled={votingId === comment.id}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.user_vote === 1
                            ? 'text-indigo-600 font-medium'
                            : 'text-slate-500 hover:text-indigo-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.vote_count}</span>
                      </button>

                      {/* Downvote */}
                      <button
                        onClick={() =>
                          handleVote(comment.id, comment.user_vote === -1 ? 0 : -1)
                        }
                        disabled={votingId === comment.id}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.user_vote === -1
                            ? 'text-red-600 font-medium'
                            : 'text-slate-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>

                      {/* Reply count (placeholder for Phase 5) */}
                      {comment.reply_count > 0 && (
                        <span className="text-sm text-slate-500">
                          {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button - NO INFINITE SCROLL */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  onClick={() => fetchComments(true)}
                  variant="outline"
                  size="md"
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
