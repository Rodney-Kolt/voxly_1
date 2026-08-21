'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  postComment,
  subscribeToComments,
  deleteComment,
  Comment as CommentType,
} from '@/lib/firestore'
import { CommentItem } from './CommentItem'

interface CommentsSectionProps {
  pollId: string
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ pollId }) => {
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [comments, setComments] = useState<CommentType[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Subscribe to real-time comment updates (also handles initial load)
  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToComments(pollId, (updatedComments) => {
      setComments(updatedComments)
      setLoading(false)  // Mark loading complete when first batch arrives
    })

    return () => unsubscribe()
  }, [pollId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Please sign in to comment')
      return
    }

    if (!body.trim()) {
      setError('Comment cannot be empty')
      return
    }

    const commentText = body.trim()
    
    // Optimistic update: immediately clear input for good UX
    setBody('')
    setError('')

    startTransition(async () => {
      try {
        // Send comment to server
        await postComment(pollId, commentText)
        // Comment will appear via subscription when server confirms
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to post comment')
        // Revert optimistic update if submission fails
        setBody(commentText)
      }
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return

    try {
      await deleteComment(commentId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-secondary mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}

            <div className="flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
                maxLength={500}
                disabled={isPending}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">{body.length}/500</p>
                <button
                  type="submit"
                  disabled={isPending || !body.trim()}
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 pb-8 border-b border-gray-200 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-center">
          <p className="font-medium">Sign in to comment</p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isOwner={user?.uid === comment.userId}
              onDelete={() => handleDeleteComment(comment.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
