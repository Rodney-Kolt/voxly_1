'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  Comment as CommentType,
  getUserReactionForComment,
  getReactionCounts,
  subscribeToReactions,
  toggleReaction,
  formatDate,
} from '@/lib/firestore'
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react'

interface CommentItemProps {
  comment: CommentType
  isOwner: boolean
  onDelete: () => void
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, isOwner, onDelete }) => {
  const { user } = useAuth()
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null)
  const [loadingReaction, setLoadingReaction] = useState(false)

  // Fetch reaction counts and user's reaction
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const counts = await getReactionCounts(comment.id)
        setLikeCount(counts.likes)
        setDislikeCount(counts.dislikes)

        if (user) {
          const userReact = await getUserReactionForComment(comment.id, user.uid)
          setUserReaction(userReact?.type || null)
        }
      } catch (err) {
        console.error('Error fetching reactions:', err)
      }
    }

    fetchReactions()
  }, [comment.id, user])

  // Subscribe to real-time reaction updates
  useEffect(() => {
    const unsubscribe = subscribeToReactions(comment.id, (counts) => {
      setLikeCount(counts.likes)
      setDislikeCount(counts.dislikes)
    })

    return () => unsubscribe()
  }, [comment.id])

  const handleToggleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      alert('Please sign in to react')
      return
    }

    try {
      setLoadingReaction(true)
      await toggleReaction(comment.id, type)
    } catch (err) {
      console.error('Error toggling reaction:', err)
    } finally {
      setLoadingReaction(false)
    }
  }

  return (
    <div className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0">
      {/* Avatar */}
      {comment.userAvatarUrl && (
        <img
          src={comment.userAvatarUrl}
          alt={comment.userDisplayName}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{comment.userDisplayName}</p>
            <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>

          {isOwner && (
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 text-red-600 rounded transition"
              title="Delete comment"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Body */}
        <p className="mt-2 text-gray-700 break-words">{comment.body}</p>

        {/* Reactions */}
        <div className="mt-3 flex gap-4">
          <button
            onClick={() => handleToggleReaction('like')}
            disabled={loadingReaction || !user}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              userReaction === 'like'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            <ThumbsUp size={14} />
            <span className="text-xs font-medium">{likeCount}</span>
          </button>

          <button
            onClick={() => handleToggleReaction('dislike')}
            disabled={loadingReaction || !user}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
              userReaction === 'dislike'
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            <ThumbsDown size={14} />
            <span className="text-xs font-medium">{dislikeCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
