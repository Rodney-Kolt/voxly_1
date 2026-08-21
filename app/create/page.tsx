'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { createPoll } from '@/lib/firestore'
import { X, Plus } from 'lucide-react'

export default function CreatePollPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [imageUrl, setImageUrl] = useState('')
  const [closesAt, setClosesAt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ''])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!question.trim()) {
      setError('Question is required')
      return
    }

    if (options.some((opt) => !opt.trim())) {
      setError('All options must be filled in')
      return
    }

    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) {
      setError('Options must be unique')
      return
    }

    try {
      setIsSubmitting(true)

      const closeDate = closesAt ? new Date(closesAt) : undefined

      const pollId = await createPoll(
        question.trim(),
        options.map((o) => o.trim()),
        imageUrl.trim() || undefined,
        closeDate
      )

      // Redirect to poll detail page
      router.push(`/poll/${pollId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-2">Create a Poll</h1>
          <p className="text-lg text-gray-600">Ask your community a question</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Question */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question *
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{question.length}/200</p>
          </div>

          {/* Options */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Options ({options.length}/5) *
            </label>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    maxLength={100}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="px-3 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-4 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Add Option
              </button>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a valid image URL to display with your poll
            </p>
          </div>

          {/* Close Date */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Close Poll (optional)
            </label>
            <input
              type="datetime-local"
              value={closesAt}
              onChange={(e) => setClosesAt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to keep the poll open indefinitely
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Poll'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
