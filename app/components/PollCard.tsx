'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Poll } from '@/lib/firestore'
import { Flame } from 'lucide-react'

interface PollCardProps {
  poll: Poll
  onClick?: () => void
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onClick }) => {
  const [hovering, setHovering] = useState(false)

  // Compute vote percentages
  const totalVotes = poll.totalVotes || 0
  const optionVotes = new Array(poll.options.length).fill(0)
  const percentages = optionVotes.map((votes) =>
    totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  )

  // Format vote count (1200 → 1.2k)
  const formatVotes = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    }
    return count.toString()
  }

  // Check if poll is boosted and active
  const isBoostedActive = poll.isBoosted && poll.boostedUntil
    ? new Date(poll.boostedUntil.toDate?.() || poll.boostedUntil) > new Date()
    : false

  // Check if poll is closed
  const isClosed = poll.closesAt ? new Date(poll.closesAt.toDate?.() || poll.closesAt) < new Date() : false

  return (
    <Link href={`/poll/${poll.id}`}>
      <div
        className={`
          bg-voxly-card border border-voxly-border rounded-3xl p-5 md:p-6
          transition-all duration-300 ease-out
          hover:shadow-card-dark hover:border-voxly-accent-hover
          ${hovering ? '-translate-y-0.5' : 'translate-y-0'}
          cursor-pointer group
        `}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={onClick}
      >
        {/* Header with Status Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* Poll Question */}
            <h3 className="font-serif text-poll-title-mobile md:text-poll-title-desktop text-voxly-text leading-snug break-words">
              {poll.question}
            </h3>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 flex-shrink-0">
            {isBoostedActive && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-voxly-boost/10 border border-voxly-boost">
                <Flame size={14} className="text-voxly-boost flex-shrink-0" />
                <span className="text-xs font-medium text-voxly-boost uppercase tracking-wide whitespace-nowrap">
                  Boosted
                </span>
              </div>
            )}
            {isClosed && (
              <div className="px-3 py-1 rounded-full bg-voxly-closed/10 border border-voxly-closed">
                <span className="text-xs font-medium text-voxly-closed uppercase tracking-wide">Closed</span>
              </div>
            )}
          </div>
        </div>

        {/* Options with Vote Percentages */}
        <div className="space-y-3 mb-5">
          {poll.options.map((option, index) => {
            const percentage = percentages[index] || 0
            return (
              <div key={index} className="group/option">
                {/* Option text and percentage */}
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-sm md:text-base text-voxly-text group-hover/option:text-voxly-accent transition-colors truncate">
                    {option}
                  </span>
                  <span className="text-sm font-medium text-voxly-text-muted tabular-nums flex-shrink-0">
                    {percentage}%
                  </span>
                </div>

                {/* Percentage Bar */}
                <div className="w-full h-1 bg-voxly-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-voxly-accent transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer with Vote Count and Category */}
        <div className="flex items-center justify-between pt-4 border-t border-voxly-border">
          <span className="text-xs md:text-sm font-medium text-voxly-text-muted tabular-nums">
            {formatVotes(totalVotes)} votes
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PollCard
