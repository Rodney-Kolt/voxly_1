'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllBoostedPolls, Poll, getUserProfile } from '@/lib/firestore'
import { MessageCircle, BarChart3, Zap } from 'lucide-react'

interface PollWithAuthor extends Poll {
  authorName?: string
  authorAvatar?: string
  commentCount?: number
}

export const BoostedPolls: React.FC = () => {
  const [polls, setPolls] = useState<PollWithAuthor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoostedPolls = async () => {
      try {
        const boostedPollsData = await getAllBoostedPolls()

        // Fetch author info for each poll
        const pollsWithAuthors: PollWithAuthor[] = await Promise.all(
          boostedPollsData.map(async (poll) => {
            const author = await getUserProfile(poll.userId)
            return {
              ...poll,
              authorName: author?.displayName || 'Anonymous',
              authorAvatar: author?.avatarUrl || null,
            } as PollWithAuthor
          })
        )

        setPolls(pollsWithAuthors)
      } catch (error) {
        console.error('Error fetching boosted polls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoostedPolls()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {Array(2).fill(null).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 h-64 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
          <Zap size={20} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-secondary">Featured Polls</h2>
        <span className="text-sm font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
          {polls.length} Boosted
        </span>
      </div>

      {/* Boosted Polls Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <Link key={poll.id} href={`/poll/${poll.id}`}>
            <div className="relative bg-white rounded-xl border-2 border-yellow-300 p-6 hover:shadow-lg hover:border-yellow-400 transition-all duration-300 cursor-pointer h-full overflow-hidden">
              {/* Boosted Badge */}
              <div className="absolute top-0 right-0 bg-yellow-400 text-white px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                <Zap size={14} />
                Featured
              </div>

              {/* Gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
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
                      className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700 truncate"
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
                <div className="flex gap-4 pt-4 border-t border-yellow-200 text-sm text-gray-600">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
