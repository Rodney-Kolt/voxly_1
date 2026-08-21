'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllPolls, Poll, getUserProfile, formatDate } from '@/lib/firestore'
import { MessageCircle, BarChart3 } from 'lucide-react'

interface PollWithAuthor extends Poll {
  authorName?: string
  authorAvatar?: string
  commentCount?: number
}

export const PollList: React.FC = () => {
  const [polls, setPolls] = useState<PollWithAuthor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsData = await getAllPolls(20)

        // Fetch author info for each poll
        const pollsWithAuthors = await Promise.all(
          pollsData.map(async (poll) => {
            const author = await getUserProfile(poll.userId)
            return {
              ...poll,
              authorName: author?.displayName || 'Anonymous',
              authorAvatar: author?.avatarUrl || null,
            }
          })
        )

        setPolls(pollsWithAuthors)
      } catch (error) {
        console.error('Error fetching polls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {Array(4).fill(null).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 h-64 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No polls yet</h3>
        <p className="text-gray-600">
          Be the first to create a poll! Click the "Create Poll" button to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {polls.map((poll) => (
        <Link key={poll.id} href={`/poll/${poll.id}`}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              {poll.authorAvatar && (
                <img
                  src={poll.authorAvatar}
                  alt={poll.authorName}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {poll.authorName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(poll.createdAt)}
                </p>
              </div>
            </div>

            {/* Question */}
            <h3 className="text-lg font-bold text-secondary mb-4 line-clamp-2">
              {poll.question}
            </h3>

            {/* Image */}
            {poll.imageUrl && (
              <div className="mb-4 h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={poll.imageUrl}
                  alt="Poll"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Options Preview */}
            <div className="mb-4 space-y-2">
              {poll.options.slice(0, 2).map((option, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700 truncate"
                >
                  {option}
                </div>
              ))}
              {poll.options.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{poll.options.length - 2} more {poll.options.length - 2 === 1 ? 'option' : 'options'}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <BarChart3 size={16} />
                <span>{poll.totalVotes || 0} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={16} />
                <span>{poll.commentCount || 0} comments</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
