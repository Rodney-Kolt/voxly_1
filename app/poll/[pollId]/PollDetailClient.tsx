'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPoll, getUserProfile, formatDate, getTimeRemaining, Poll, isPollClosed } from '@/lib/firestore'
import { PollVoting } from '@/app/components/PollVoting'
import { CommentsSection } from '@/app/components/CommentsSection'
import { BoostButton } from '@/app/components/BoostButton'
import { ChevronLeft, Calendar, Lock } from 'lucide-react'

interface PollDetailClientProps {
  pollId: string
}

export function PollDetailClient({ pollId }: PollDetailClientProps) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [authorAvatar, setAuthorAvatar] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        setLoading(true)

        // Fetch poll and author info in parallel
        const pollData = await getPoll(pollId)
        if (!pollData) {
          setError('Poll not found')
          return
        }

        // Fetch author in parallel
        const [, author] = await Promise.all([
          Promise.resolve(pollData),
          getUserProfile(pollData.userId)
        ])

        setPoll(pollData)
        if (author) {
          setAuthorName(author.displayName)
          setAuthorAvatar(author.avatarUrl || '')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load poll')
      } finally {
        setLoading(false)
      }
    }

    if (pollId) {
      fetchPollData()
    }
  }, [pollId])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <p className="text-gray-600 font-medium">Loading poll...</p>
        </div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ChevronLeft size={20} />
            Back to polls
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-600">
            <p className="font-semibold">{error || 'Poll not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const isClosed = isPollClosed(poll.closesAt)
  const timeRemaining = getTimeRemaining(poll.closesAt)

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ChevronLeft size={20} />
          Back to polls
        </Link>

        {/* Poll Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{authorName}</p>
              <p className="text-sm text-gray-500">{formatDate(poll.createdAt)}</p>
            </div>
          </div>

          {/* Question */}
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-6">
            {poll.question}
          </h1>

          {/* Image */}
          {poll.imageUrl && (
            <div className="mb-8 h-64 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={poll.imageUrl}
                alt="Poll"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status and Time */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            {isClosed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                <Lock size={18} />
                Poll Closed
              </div>
            ) : poll.closesAt ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                <Calendar size={18} />
                {timeRemaining}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                <Calendar size={18} />
                Open indefinitely
              </div>
            )}
          </div>

          {/* Boost Button */}
          <div className="mb-6">
            <BoostButton
              pollId={pollId}
              isBoosted={poll.isBoosted || false}
              boostedUntil={poll.boostedUntil?.toDate()}
            />
          </div>
        </div>

        {/* Voting Section */}
        <PollVoting poll={poll} />

        {/* Comments Section */}
        <div className="mt-8">
          <CommentsSection pollId={pollId} />
        </div>
      </div>
    </div>
  )
}
