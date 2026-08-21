'use client'

import React from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 md:py-32">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <PlusCircle size={64} className="text-voxly-text-muted opacity-40" />
        </div>

        {/* Heading */}
        <h2 className="font-serif text-2xl md:text-3xl text-voxly-text mb-3">
          No Polls Yet
        </h2>

        {/* Subtitle */}
        <p className="text-voxly-text-muted text-sm md:text-base mb-8 leading-relaxed">
          Be the first to create a poll and start gathering insights from the community.
        </p>

        {/* CTA Button */}
        <Link href="/create">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-voxly-accent hover:bg-voxly-accent-hover text-voxly-bg font-medium rounded-full transition-colors duration-200">
            <PlusCircle size={18} />
            Create the First Poll
          </button>
        </Link>
      </div>
    </div>
  )
}

export default EmptyState
