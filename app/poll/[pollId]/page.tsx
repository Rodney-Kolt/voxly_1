import React, { Suspense } from 'react'
import { PollDetailClient } from './PollDetailClient'

// Skip pre-rendering - load dynamically on request
export const dynamic = 'force-dynamic'

export default function PollDetailPage({ params }: { params: { pollId: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <p className="text-gray-600 font-medium">Loading poll...</p>
        </div>
      </div>
    }>
      <PollDetailClient pollId={params.pollId} />
    </Suspense>
  )
}
