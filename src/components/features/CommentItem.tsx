'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Edit3, Trash2, ChevronDown, Flag, MinusSquare, PlusSquare } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const COLLAPSE_DEPTH = 1

interface CommentItemProps {
  comment: any
  depth?: number
  currentUserId?: string
  dict: any // ✅ Required for translations
  onEdit: (id: string, newContent: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onReport: (id: string) => void
  onVote: (id: string, value: number) => Promise<void>
}

export function CommentItem({ comment, depth = 0, currentUserId, dict, onEdit, onDelete, onReport, onVote }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(depth >= COLLAPSE_DEPTH)

  const supabase = createClient()
  const hasChildren = comment.replies && comment.replies.length > 0
  const isEdited = comment.updated_at && new Date(comment.updated_at).getTime() > new Date(comment.created_at).getTime() + 1000

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return
    if (!currentUserId) return toast.error(dict.login_to_comment)
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('comments').insert({
        content: replyContent, city_slug: comment.city_slug, place_slug: comment.place_slug, parent_id: comment.id, user_id: currentUserId
      })
      if (error) throw error
      toast.success('Reply posted!')
      setReplyContent('')
      setIsReplying(false)
      setIsCollapsed(false)
      window.location.reload() 
    } catch (error) { toast.error('Failed') } finally { setIsSubmitting(false) }
  }

  const handleEditSave = async () => {
    if (editContent === comment.content) { setIsEditing(false); return; }
    await onEdit(comment.id, editContent)
    setIsEditing(false)
  }

  if (isCollapsed && hasChildren) {
    return (
      <div className={`mt-2 ${depth > 0 ? 'ml-4 md:ml-6' : ''}`}>
        <button onClick={() => setIsCollapsed(false)} className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-md transition-colors">
          <PlusSquare className="w-4 h-4" />
          <span>{dict.show_more} {comment.replies.length} {dict.replies}...</span>
        </button>
      </div>
    )
  }

  return (
    <div className={depth === 0 ? "border-b border-slate-100 dark:border-slate-800 pb-6 mb-6" : "mt-4"}>
      <div className={`${depth > 0 ? 'ml-4 md:ml-6 border-l-2 border-slate-100 dark:border-slate-800 pl-4' : ''}`}>
        <div className="flex gap-3 group">
          <Link href={`/users/${comment.profiles?.id}`} className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {comment.profiles?.avatar_url ? <img src={comment.profiles.avatar_url} alt="User" className="w-full h-full object-cover" /> : (comment.profiles?.display_name?.[0] || '?').toUpperCase()}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Link href={`/users/${comment.profiles?.id}`} className="font-semibold text-slate-900 dark:text-slate-200 hover:underline">{comment.profiles?.display_name || 'Traveler'}</Link>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
              {isEdited && <span className="italic text-slate-400">({dict.edited})</span>}
              {hasChildren && <button onClick={() => setIsCollapsed(true)} className="ml-auto text-slate-400 hover:text-slate-600 p-1" title={dict.collapse_thread}><MinusSquare className="w-3.5 h-3.5" /></button>}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 text-sm border rounded-md dark:bg-slate-800 dark:border-slate-700" rows={3} />
                <div className="flex gap-2">
                  <button onClick={handleEditSave} disabled={isSubmitting} className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700">{dict.save}</button>
                  <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700">{dict.cancel}</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 rounded-full px-2 py-0.5 border border-slate-200 dark:border-slate-800">
                <button onClick={() => onVote(comment.id, 1)} className={`p-1 rounded-full hover:bg-slate-200 ${comment.user_vote === 1 ? 'text-orange-500' : 'text-slate-400'}`}><ChevronDown className="w-4 h-4 rotate-180" /></button>
                <span className="text-xs font-medium text-slate-500">{comment.vote_count}</span>
                <button onClick={() => onVote(comment.id, -1)} className={`p-1 rounded-full hover:bg-slate-200 ${comment.user_vote === -1 ? 'text-blue-500' : 'text-slate-400'}`}><ChevronDown className="w-4 h-4" /></button>
              </div>
              <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"><MessageCircle className="w-4 h-4" /> {dict.reply}</button>
              {currentUserId === comment.user_id && (
                <><button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600 p-1"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(comment.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 className="w-3.5 h-3.5" /></button></>
              )}
            </div>

            {isReplying && (
              <div className="mt-3 pl-2 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={dict.write_reply} className="w-full p-2 text-sm border rounded-md dark:bg-slate-900 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleReplySubmit} disabled={isSubmitting} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{isSubmitting ? '...' : dict.reply}</button>
                  <button onClick={() => setIsReplying(false)} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700">{dict.cancel}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && hasChildren && (
          <div className="mt-2">
            {comment.replies.map((reply: any) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} currentUserId={currentUserId} dict={dict} onEdit={onEdit} onDelete={onDelete} onReport={onReport} onVote={onVote} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}