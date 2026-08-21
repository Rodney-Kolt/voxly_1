'use client'

import React, { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

function PaymentResultContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'cancelled' | 'pending' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get status from URL params
    const statusParam = searchParams.get('status') as
      | 'success'
      | 'cancelled'
      | 'pending'
      | null

    setStatus(statusParam || 'pending')
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <p className="text-gray-600 font-medium">Processing payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md mx-auto">
        {status === 'success' ? (
          <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
              <CheckCircle size={48} className="text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-secondary mb-3">Payment Successful!</h1>

            <p className="text-gray-600 mb-6">
              Your poll has been boosted and is now featured at the top of the homepage for 24
              hours. Great choice!
            </p>

            <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
              <p className="text-sm text-green-700">
                ✓ Poll boost activated  
                ✓ Visible for 24 hours  
                ✓ Maximum exposure
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/profile"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition text-center"
              >
                My Polls
              </Link>
            </div>
          </div>
        ) : status === 'cancelled' ? (
          <div className="bg-white rounded-2xl border border-yellow-200 shadow-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
              <AlertCircle size={48} className="text-yellow-600" />
            </div>

            <h1 className="text-3xl font-bold text-secondary mb-3">Payment Cancelled</h1>

            <p className="text-gray-600 mb-6">
              Your payment was cancelled. Your poll was not boosted. You can try again anytime.
            </p>

            <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
              <p className="text-sm text-yellow-700">
                No charges were made to your account.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/profile"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition text-center"
              >
                My Polls
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-blue-200 shadow-lg p-8 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
              <Clock size={48} className="text-blue-600 animate-spin" />
            </div>

            <h1 className="text-3xl font-bold text-secondary mb-3">Processing Payment...</h1>

            <p className="text-gray-600 mb-6">
              Your payment is being processed. We're verifying with Pesapal and will update your
              poll shortly.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <p className="text-sm text-blue-700">
                ⏳ This usually takes a few seconds. You'll be notified once complete.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/profile"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition text-center"
              >
                My Polls
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            <strong>What happens next?</strong>
          </p>
          <p className="text-sm text-gray-600">
            Your boosted poll appears at the top of our homepage and gets maximum visibility.
            Check back after 24 hours to see how many votes you received!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  )
}
