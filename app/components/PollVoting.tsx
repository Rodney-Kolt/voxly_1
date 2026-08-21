'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  Poll,
  Vote,
  getUserVoteForPoll,
  castVote,
  getVotesByOption,
  subscribeToVotes,
  isPollClosed,
} from '@/lib/firestore'
import { CheckCircle, Lock } from 'lucide-react'

interface PollVotingProps {
  poll: Poll
}

export const PollVoting: React.FC<PollVotingProps> = ({ poll }) => {
  const { user } = useAuth()
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [voteCounts, setVoteCounts] = useState<number[]>(
    new Array(poll.options.length).fill(0)
  )
  const [loadingVote, setLoadingVote] = useState(false)
  const [error, setError] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const totalVotes = voteCounts.reduce((a, b) => a + b, 0)
  const isClosed = isPollClosed(poll.closesAt)
  const hasVoted = userVote !== null

  // Fetch user's vote and vote counts
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const vote = await getUserVoteForPoll(poll.id, user.uid)
        setUserVote(vote)

        const counts = await getVotesByOption(poll.id)
        setVoteCounts(counts)
      } catch (err) {
        console.error('Error fetching voting data:', error)
      }
    }

    fetchData()
  }, [poll.id, user])

  // Subscribe to real-time vote updates
  useEffect(() => {
    if (!poll.id) return

    const unsubscribe = subscribeToVotes(poll.id, (counts) => {
      setVoteCounts(counts)
    })

    return () => unsubscribe()
  }, [poll.id])

  const handleVote = async (optionIndex: number) => {
    if (!user) {
      setError('Please sign in to vote')
      return
    }

    if (hasVoted) {
      setError('You have already voted on this poll')
      return
    }

    try {
      setLoadingVote(true)
      setError('')
      setSelectedOption(optionIndex)

      await castVote(poll.id, optionIndex)
      setUserVote({
        id: `temp-${Date.now()}`,
        pollId: poll.id,
        userId: user.uid,
        optionIndex,
        createdAt: new Date() as any,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote')
      setSelectedOption(null)
    } finally {
      setLoadingVote(false)
    }
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  // Show results if poll is closed or user has voted
  const showResults = isClosed || hasVoted

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {/* Status */}
      <div className="mb-6">
        {isClosed && (
          <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700">
            <Lock size={20} />
            <span className="font-semibold">This poll has closed</span>
          </div>
        )}
        {hasVoted && !isClosed && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={20} />
            <span className="font-semibold">You have voted on this poll</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Options */}
      <div className="space-y-4 mb-6">
        {poll.options.map((option, index) => {
          const votes = voteCounts[index] || 0
          const percentage = getPercentage(votes)
          const isSelected = userVote?.optionIndex === index
          const isHovering = selectedOption === index

          return (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={showResults || loadingVote || !user}
              className={`relative w-full text-left overflow-hidden rounded-lg transition-all ${
                showResults || !user
                  ? 'cursor-default'
                  : 'cursor-pointer hover:shadow-md'
              } ${
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'border border-gray-300'
              }`}
            >
              {/* Background bar for results */}
              {showResults && (
                <div
                  className="absolute inset-0 bg-blue-100 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{option}</p>
                  {showResults && (
                    <p className="text-sm text-gray-600 mt-1">
                      {percentage}% ({votes} {votes === 1 ? 'vote' : 'votes'})
                    </p>
                  )}
                </div>
                {isSelected && (
                  <div className="ml-4">
                    <CheckCircle size={24} className="text-primary" />
                  </div>
                )}
              </div>

              {/* Hover effect for voting */}
              {!showResults && !loadingVote && (
                <div
                  className={`absolute inset-0 bg-blue-50 transition-opacity ${
                    isHovering ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
        <span>Total votes: {totalVotes}</span>
        {!showResults && <span className="text-blue-600 font-medium">Click to vote</span>}
      </div>
    </div>
  )
}
