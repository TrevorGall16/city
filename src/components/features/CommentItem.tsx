'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageCircle,
  Edit3,
  Trash2,
  ChevronDown,
  Flag,
  MinusSquare,
  PlusSquare
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

// ✅ STRICTER COLLAPSE SETTING
// Depth 0 = Main Comment (Open)
// Depth 1 = Direct Reply (Open)
// Depth 2+ = Nested Replies (Auto-Collapsed)
const COLLAPSE_DEPTH = 1

interface CommentItemProps {
  comment: any
  depth?: number
  currentUserId?: string
  onEdit: (id: string, newContent: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReport: (id: string) => void
  onVote: (id: string, value: number) => Promise<void>
}

export function CommentItem({
  comment,
  depth = 0,
  currentUserId,
  onEdit,
  onDelete,
  onReport,
  onVote
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ✅ LOGIC: If depth is greater than 1, hide children by default
  const [isCollapsed, setIsCollapsed] = useState(depth >= COLLAPSE_DEPTH)

  const supabase = createClient()
  const hasChildren = comment.replies && comment.replies.length > 0

  // Check if edited
  const isEdited = comment.updated_at && 
    new Date(comment.updated_at).getTime() > new Date(comment.created_at).getTime() + 1000

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    if (!currentUserId) {
      toast.error('Please log in to reply')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('comments').insert({
        content: replyContent,
        city_slug: comment.city_slug,
        place_slug: comment.place_slug,
        parent_id: comment.id,
        user_id: currentUserId
      })

      if (error) throw error

      toast.success('Reply posted!')
      setReplyContent('')
      setIsReplying(false)
      setIsCollapsed(false) // Auto-open to see new reply
      window.location.reload() 
    } catch (error) {
      toast.error('Failed to post reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSave = async () => {
    if (editContent === comment.content) {
      setIsEditing(false)
      return
    }
    await onEdit(comment.id, editContent)
    setIsEditing(false)
  }

  // ✅ COLLAPSED BUTTON (Appears if depth >= 1 and has replies)
  if (isCollapsed && hasChildren) {
    return (
      <div className={`mt-2 ${depth > 0 ? 'ml-4 md:ml-6' : ''}`}>
        <button 
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-md transition-colors"
        >
          <PlusSquare className="w-4 h-4" />
          <span>Show {comment.replies.length} more {comment.replies.length === 1 ? 'reply' : 'replies'}...</span>
        </button>
      </div>
    )
  }

  // ✅ ROOT SEPARATOR (Adds a line under the main parent comment thread)
  const containerStyle = depth === 0 
    ? "border-b border-slate-100 dark:border-slate-800 pb-6 mb-6" 
    : "mt-4"

  return (
    <div className={containerStyle}>
      <div className={`
        ${depth > 0 ? 'ml-4 md:ml-6' : ''} 
        ${depth > 0 ? 'border-l-2 border-slate-100 dark:border-slate-800 pl-4' : ''}
      `}>
        <div className="flex gap-3 group">
          {/* Avatar */}
          <Link href={`/users/${comment.profiles?.id}`} className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
              {comment.profiles?.avatar_url ? (
                <img src={comment.profiles.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {(comment.profiles?.display_name?.[0] || '?').toUpperCase()}
                </span>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Link href={`/users/${comment.profiles?.id}`} className="font-semibold text-slate-900 dark:text-slate-200 hover:underline">
                {comment.profiles?.display_name || 'Traveler'}
              </Link>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
              
              {isEdited && <span className="italic text-slate-400">(edited)</span>}

              {/* Manual Collapse Toggle [-] */}
              {hasChildren && (
                <button 
                  onClick={() => setIsCollapsed(true)} 
                  className="ml-auto text-slate-400 hover:text-slate-600 p-1"
                  title="Collapse thread"
                >
                  <MinusSquare className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Content Body */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md dark:bg-slate-800 dark:border-slate-700"
                  rows={3}
                  maxLength={500}
                />
                <div className="flex gap-2">
                  <button onClick={handleEditSave} disabled={isSubmitting} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-4 mt-2">
              {/* Votes */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 rounded-full px-2 py-0.5 border border-slate-200 dark:border-slate-800">
                <button onClick={() => onVote(comment.id, 1)} className={`p-1 rounded-full hover:bg-slate-200 ${comment.user_vote === 1 ? 'text-orange-500' : 'text-slate-400'}`}>
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
                <span className={`text-xs font-medium min-w-[12px] text-center ${comment.vote_count > 0 ? 'text-orange-500' : comment.vote_count < 0 ? 'text-blue-500' : 'text-slate-500'}`}>{comment.vote_count}</span>
                <button onClick={() => onVote(comment.id, -1)} className={`p-1 rounded-full hover:bg-slate-200 ${comment.user_vote === -1 ? 'text-blue-500' : 'text-slate-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Reply */}
              <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors">
                <MessageCircle className="w-4 h-4" /> Reply
              </button>

              {/* Owner Actions */}
              {currentUserId === comment.user_id && (
                <>
                  <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(comment.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </>
              )}
              {/* Report */}
              {currentUserId !== comment.user_id && (
                <button onClick={() => onReport(comment.id)} className="text-slate-400 hover:text-orange-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Flag className="w-3.5 h-3.5" /></button>
              )}
            </div>

            {/* Reply Input */}
            {isReplying && (
              <div className="mt-3 pl-2 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Write a reply..." className="w-full p-2 text-sm border rounded-md dark:bg-slate-900 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleReplySubmit} disabled={isSubmitting} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{isSubmitting ? 'Posting...' : 'Reply'}</button>
                  <button onClick={() => setIsReplying(false)} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recursive Children (Replies) */}
        {!isCollapsed && hasChildren && (
          <div className="mt-2">
            {comment.replies.map((reply: any) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1} 
                currentUserId={currentUserId} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onReport={onReport} 
                onVote={onVote} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}