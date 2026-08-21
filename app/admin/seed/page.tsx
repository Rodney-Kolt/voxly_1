'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'

export default function SeedDataPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [pollId, setPollId] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔐 Admin Access Required
          </h1>
          <p className="text-gray-600">
            Please sign in to access the seed data page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const createSamplePoll = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const pollsRef = collection(db, 'polls')
      const votesRef = collection(db, 'votes')
      const commentsRef = collection(db, 'comments')

      // Create poll
      const pollDoc = await addDoc(pollsRef, {
        userId: user.uid,
        question: 'Who is the GOAT? Ronaldo or Messi?',
        options: ['Cristiano Ronaldo', 'Lionel Messi'],
        imageUrl:
          'https://images.unsplash.com/photo-1579953346881-04a9c73ea437?w=500&h=300&fit=crop',
        createdAt: serverTimestamp(),
        isBoosted: false,
        totalVotes: 0,
      })

      const newPollId = pollDoc.id
      setPollId(newPollId)

      // Add sample votes
      const votesData = [
        { optionIndex: 0, userId: 'user-1' }, // Ronaldo
        { optionIndex: 1, userId: 'user-2' }, // Messi
        { optionIndex: 0, userId: 'user-3' }, // Ronaldo
        { optionIndex: 0, userId: 'user-4' }, // Ronaldo
        { optionIndex: 1, userId: 'user-5' }, // Messi
        { optionIndex: 0, userId: 'user-6' }, // Ronaldo
        { optionIndex: 1, userId: 'user-7' }, // Messi
        { optionIndex: 0, userId: 'user-8' }, // Ronaldo
      ]

      for (const vote of votesData) {
        await addDoc(votesRef, {
          pollId: newPollId,
          userId: vote.userId,
          optionIndex: vote.optionIndex,
          createdAt: serverTimestamp(),
        })
      }

      // Add sample comments
      const commentsData = [
        {
          body: 'Ronaldo is the most complete player ever!',
          userId: 'user-1',
          displayName: 'John',
        },
        {
          body: 'Messi is pure magic on the field',
          userId: 'user-2',
          displayName: 'Maria',
        },
        {
          body: 'Ronaldo has more goals and trophies',
          userId: 'user-3',
          displayName: 'Ahmed',
        },
        {
          body: 'Messi won the World Cup though!',
          userId: 'user-4',
          displayName: 'Sofia',
        },
      ]

      for (const comment of commentsData) {
        await addDoc(commentsRef, {
          pollId: newPollId,
          userId: comment.userId,
          body: comment.body,
          userDisplayName: comment.displayName,
          createdAt: serverTimestamp(),
        })
      }

      setSuccess(true)
      console.log('✅ Sample poll created:', newPollId)
    } catch (err) {
      console.error('Error creating sample poll:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to create sample poll'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Create Sample Poll
          </h1>
          <p className="text-gray-600">
            Add a sample "Ronaldo vs Messi" poll to test the app
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🐐 Ronaldo vs Messi Poll
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Question: Who is the GOAT?
              </p>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                  <span className="text-2xl mr-3">⚽</span>
                  <span className="font-semibold text-gray-900">
                    Cristiano Ronaldo
                  </span>
                  <span className="ml-auto text-sm text-gray-600">
                    5 votes (62%)
                  </span>
                </div>
                <div className="flex items-center p-3 bg-white rounded border border-gray-200">
                  <span className="text-2xl mr-3">⚽</span>
                  <span className="font-semibold text-gray-900">
                    Lionel Messi
                  </span>
                  <span className="ml-auto text-sm text-gray-600">
                    3 votes (38%)
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Sample Data Included:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  8 sample votes (5 for Ronaldo, 3 for Messi)
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  4 sample comments from different users
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Real-time voting interface
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Comments section with reactions
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Poll boosting button (pay KES 100)
                </li>
              </ul>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-semibold">❌ Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && pollId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">
                ✅ Poll Created Successfully!
              </p>
              <p className="text-green-700 text-sm mb-4">
                Poll ID: <code className="bg-white px-2 py-1 rounded">{pollId}</code>
              </p>
              <button
                onClick={() => router.push(`/poll/${pollId}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                View Poll →
              </button>
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={createSamplePoll}
            disabled={loading || success}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || success
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading
              ? '⏳ Creating Poll...'
              : success
                ? '✅ Poll Created!'
                : '🚀 Create Sample Poll'}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">What You Can Do:</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>
              • <strong>Vote</strong> on the poll and see results update in real-time
            </li>
            <li>
              • <strong>Comment</strong> on the poll with your opinion
            </li>
            <li>
              • <strong>React</strong> to comments (like/dislike)
            </li>
            <li>
              • <strong>Boost</strong> the poll for KES 100 using Pesapal
            </li>
            <li>
              • <strong>Test</strong> the complete payment flow with demo M-Pesa
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
