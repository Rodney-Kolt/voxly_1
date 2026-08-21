'use client'

import React, { useState, useEffect, useRef } from 'react'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Poll } from '@/lib/firestore'
import PollCard from './PollCard'
import EmptyState from './EmptyState'

type FilterType = 'all' | 'new' | 'trending' | 'boosted'

interface PollFeedProps {
  className?: string
}

// In-memory cache for instant loading
const pollCache = new Map<FilterType, Poll[]>()

export const PollFeed: React.FC<PollFeedProps> = ({ className = '' }) => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasShownCacheRef = useRef(false)

  // Subscribe to polls with real-time updates
  useEffect(() => {
    // Show cached polls instantly (if they exist)
    if (pollCache.has(filter)) {
      setPolls(pollCache.get(filter) || [])
      hasShownCacheRef.current = true
    } else {
      setLoading(true)
    }
    
    setError(null)

    let pollQuery

    // Build query based on filter
    switch (filter) {
      case 'boosted':
        pollQuery = query(
          collection(db, 'polls'),
          where('isBoosted', '==', true),
          where('boostedUntil', '>', Timestamp.now()),
          orderBy('boostedUntil', 'desc')
        )
        break

      case 'new':
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
        pollQuery = query(
          collection(db, 'polls'),
          where('createdAt', '>=', Timestamp.fromDate(last24h)),
          orderBy('createdAt', 'desc')
        )
        break

      case 'trending':
        // Trending = most votes (we'll sort client-side after fetching)
        pollQuery = query(
          collection(db, 'polls'),
          orderBy('totalVotes', 'desc')
        )
        break

      case 'all':
      default:
        pollQuery = query(
          collection(db, 'polls'),
          orderBy('createdAt', 'desc')
        )
        break
    }

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      pollQuery,
      (snapshot) => {
        const pollsData: Poll[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          pollsData.push({
            id: doc.id,
            userId: data.userId,
            question: data.question,
            options: data.options || [],
            imageUrl: data.imageUrl,
            closesAt: data.closesAt,
            createdAt: data.createdAt,
            totalVotes: data.totalVotes || 0,
            isBoosted: data.isBoosted || false,
            boostedUntil: data.boostedUntil,
            boostedBy: data.boostedBy,
          })
        })

        // Sort for trending
        if (filter === 'trending') {
          pollsData.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
        }

        // Cache the results for instant loading on next visit
        pollCache.set(filter, pollsData)
        
        setPolls(pollsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching polls:', err)
        // If cache exists, use it instead of showing error
        if (pollCache.has(filter)) {
          setPolls(pollCache.get(filter) || [])
          setLoading(false)
        } else {
          setError('Failed to load polls. Please try again.')
          setLoading(false)
        }
      }
    )

    return () => unsubscribe()
  }, [filter])

  // Filter tabs
  const tabs: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Trending', value: 'trending' },
    { label: 'Boosted', value: 'boosted' },
  ]

  return (
    <div className={`w-full ${className}`}>
      {/* Filter Tabs */}
      <div className="sticky top-20 md:top-24 z-40 bg-voxly-bg/95 backdrop-blur-sm border-b border-voxly-border px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`
                text-sm md:text-base font-medium whitespace-nowrap tracking-wide uppercase
                pb-3 border-b-2 transition-colors duration-200
                ${
                  filter === tab.value
                    ? 'text-voxly-accent border-voxly-accent'
                    : 'text-voxly-text-muted border-transparent hover:text-voxly-text'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="text-center py-12">
              <p className="text-voxly-text-muted">{error}</p>
            </div>
          )}

          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="bg-voxly-card border border-voxly-border rounded-3xl p-6 h-80 animate-pulse"
                />
              ))}
            </div>
          ) : polls.length === 0 ? (
            // Empty State
            <EmptyState />
          ) : (
            // Poll Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PollFeed
