'use client'

import React, { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

interface BoostButtonProps {
  pollId: string
  isBoosted: boolean
  boostedUntil?: Date
}

export const BoostButton: React.FC<BoostButtonProps> = ({
  pollId,
  isBoosted,
  boostedUntil,
}) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBoost = async () => {
    if (!user) {
      // Redirect to sign in
      router.push('/')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Get user's ID token
      const token = await user.getIdToken()

      // Call checkout API
      const response = await fetch('/api/pesapal/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pollId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await response.json()

      // Redirect to Pesapal payment
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
    }
  }

  // Don't show button if already boosted
  if (isBoosted && boostedUntil) {
    const now = new Date()
    const boostDate = new Date(boostedUntil)
    if (boostDate > now) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg">
          <Zap size={18} className="animate-pulse" />
          <span className="font-medium">Poll is Boosted</span>
        </div>
      )
    }
  }

  // Show sign in prompt if not authenticated
  if (loading) {
    return (
      <button disabled className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed">
        Loading...
      </button>
    )
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition border border-blue-200"
      >
        <Zap size={18} />
        Sign in to Boost
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleBoost}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary hover:opacity-90 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap size={20} />
        {isLoading ? 'Processing...' : 'Boost Poll - KES 100'}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-600">
        💡 Boost your poll to the top for 24 hours. Increase visibility and get more votes!
      </p>
    </div>
  )
}
