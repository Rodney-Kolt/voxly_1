'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { getUserPolls, Poll, isPollClosed } from '@/lib/firestore'
import { MobileDashboard } from '@/app/components/MobileDashboard'

// Skip pre-rendering for client components with Firebase
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [allPolls, setAllPolls] = useState<Poll[]>([])
  const [pollsLoading, setPollsLoading] = useState(true)
  const [recentVoters, setRecentVoters] = useState<string[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Fetch user polls from Firebase
  useEffect(() => {
    const fetchPolls = async () => {
      if (!user) return

      try {
        setPollsLoading(true)
        const polls = await getUserPolls(user.uid)
        setAllPolls(polls)

        // Simulate recent voters (in real app, fetch from Firestore votes collection)
        // For now, we'll show placeholder names
        if (polls.length > 0) {
          const sampleVoters = [
            'Abdul Momon',
            'Zhofran Ardhyan',
            'Adhitya Putra',
            'Faza Dzikrullah',
            'Vito Arvy',
          ]
          setRecentVoters(sampleVoters.slice(0, Math.min(5, polls.length)))
        }
      } catch (error) {
        console.error('Error fetching polls:', error)
      } finally {
        setPollsLoading(false)
      }
    }

    if (user) {
      fetchPolls()
    }
  }, [user])

  // Separate active and closed polls
  const activePolls = allPolls.filter((poll) => !isPollClosed(poll.closesAt))
  const closedPolls = allPolls.filter((poll) => isPollClosed(poll.closesAt))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-spin mb-4">
            <div className="w-14 h-14 bg-gray-50 rounded-full" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <MobileDashboard
      userName={user.displayName?.split(' ')[0] || 'User'}
      activePolls={activePolls}
      closedPolls={closedPolls}
      recentVoters={recentVoters}
      loading={pollsLoading}
    />
  )
}
