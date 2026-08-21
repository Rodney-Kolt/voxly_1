'use client'

import React, { useState, useEffect, useTransition } from 'react'
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
  const [isPending, startTransition] = useTransition()
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [voteCounts, setVoteCounts] = useState<number[]>(
    new Array(poll.options.length).fill(0)
  )
  const [pendingVote, setPendingVote] = useState<number | null>(null)
  const [error, setError] = useState('')

  const totalVotes = voteCounts.reduce((a, b) => a + b, 0)
  const isClosed = isPollClosed(poll.closesAt)
  const hasVoted = userVote !== null

  // Batch fetch user vote and vote counts in parallel
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const [vote, counts] = await Promise.all([
          getUserVoteForPoll(poll.id, user.uid),
          getVotesByOption(poll.id)
        ])
        
        setUserVote(vote)
        setVoteCounts(counts)
      } catch (err) {
        console.error('Error fetching voting data:', err)
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

    // Optimistic update: immediately update UI
    setPendingVote(optionIndex)
    setError('')

    startTransition(async () => {
      try {
        // Send vote to server
        await castVote(poll.id, optionIndex)
        
        // Update state after successful submission
        setUserVote({
          id: `temp-${Date.now()}`,
          pollId: poll.id,
          userId: user.uid,
          optionIndex,
          createdAt: new Date() as any,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to vote')
        setPendingVote(null)
      }
    })
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  // Show results if poll is closed or user has voted
  const showResults = isClosed || hasVoted || pendingVote !== null

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
        {isPending && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full" />
            <span className="font-semibold">Submitting vote...</span>
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
          const isSelected = userVote?.optionIndex === index || pendingVote === index
          const isLoading = isPending

          return (
            <button
              key={index}
              onClick={() => handleVote(index)}
              disabled={showResults || isLoading || !user}
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
                    {isLoading ? (
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <CheckCircle size={24} className="text-primary" />
                    )}
                  </div>
                )}
              </div>

              {/* Hover effect for voting */}
              {!showResults && !isLoading && (
                <div className="absolute inset-0 bg-blue-50 opacity-0 hover:opacity-100 transition-opacity" />
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
