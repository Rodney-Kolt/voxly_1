'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { getUserPolls, Poll, formatDate } from '@/lib/firestore'
import { LogOut, Mail, User, BarChart3 } from 'lucide-react'

// Skip pre-rendering for client components with Firebase
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { user, loading, signOutUser } = useAuth()
  const router = useRouter()
  const [userPolls, setUserPolls] = useState<Poll[]>([])
  const [pollsLoading, setPollsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserPolls = async () => {
      if (!user) return

      try {
        setPollsLoading(true)
        const polls = await getUserPolls(user.uid)
        setUserPolls(polls)
      } catch (error) {
        console.error('Error fetching user polls:', error)
      } finally {
        setPollsLoading(false)
      }
    }

    if (user) {
      fetchUserPolls()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-2">Your Profile</h1>
          <p className="text-lg text-gray-600">Manage your Voxly account and polls</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-12 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-8">
            {/* Avatar */}
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User Avatar'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-blue-100"
              />
            )}

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-secondary mb-2">{user.displayName}</h2>
              <p className="text-gray-600">Welcome back to Voxly!</p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{user.displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full px-6 py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition border border-red-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Your Polls Section */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-2">Your Polls</h2>
            <p className="text-gray-600">Polls you've created</p>
          </div>

          {pollsLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-40 animate-pulse" />
              ))}
            </div>
          ) : userPolls.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No polls yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't created any polls yet. Create your first poll to get started!
              </p>
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Create First Poll
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {userPolls.map((poll) => (
                <Link key={poll.id} href={`/poll/${poll.id}`}>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer h-full">
                    {/* Date */}
                    <p className="text-xs text-gray-500 mb-2">{formatDate(poll.createdAt)}</p>

                    {/* Question */}
                    <h3 className="text-lg font-bold text-secondary mb-4 line-clamp-2">
                      {poll.question}
                    </h3>

                    {/* Options Count */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium">
                        {poll.options.length} options
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <BarChart3 size={16} />
                        <span>{poll.totalVotes || 0} votes</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
