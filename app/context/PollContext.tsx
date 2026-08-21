'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Poll } from '@/lib/firestore'

interface PollContextType {
  // Polls state
  polls: Poll[]
  setPolls: (polls: Poll[]) => void

  // Add temporary poll (optimistic UI)
  addTempPoll: (poll: Poll) => void

  // Update poll (e.g., replace temp with real)
  updatePoll: (pollId: string, updates: Partial<Poll>) => void

  // Remove poll (e.g., rollback on error)
  removePoll: (pollId: string) => void

  // Prepend poll to start of list
  prependPoll: (poll: Poll) => void
}

const PollContext = createContext<PollContextType | undefined>(undefined)

export function PollProvider({ children }: { children: React.ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([])

  const addTempPoll = useCallback((poll: Poll) => {
    setPolls((prev) => [poll, ...prev])
  }, [])

  const updatePoll = useCallback((pollId: string, updates: Partial<Poll>) => {
    setPolls((prev) =>
      prev.map((p) =>
        p.id === pollId ? { ...p, ...updates } : p
      )
    )
  }, [])

  const removePoll = useCallback((pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId))
  }, [])

  const prependPoll = useCallback((poll: Poll) => {
    setPolls((prev) => [poll, ...prev])
  }, [])

  const value: PollContextType = {
    polls,
    setPolls,
    addTempPoll,
    updatePoll,
    removePoll,
    prependPoll,
  }

  return (
    <PollContext.Provider value={value}>
      {children}
    </PollContext.Provider>
  )
}

export function usePollContext() {
  const context = useContext(PollContext)
  if (!context) {
    throw new Error('usePollContext must be used within PollProvider')
  }
  return context
}
