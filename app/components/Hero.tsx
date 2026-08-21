'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Zap } from 'lucide-react'

export const Hero: React.FC = () => {
  const { user, loading } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
          <Zap size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-blue-600">Coming Soon - Real-time Polling</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-secondary mb-6 leading-tight">
          Your Voice,{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Amplified
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create engaging polls, gather feedback in real-time, and make decisions together with your community.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {loading ? (
            <div className="h-14 w-56 bg-gray-200 rounded-lg animate-pulse" />
          ) : user ? (
            <Link
              href="/profile"
              className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
            >
              Sign in with Google
            </button>
          )}
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold text-lg hover:border-primary hover:text-primary transition">
            Learn More
          </button>
        </div>

        {/* Hero image placeholder */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl" />
          <div className="relative bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-64 sm:h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-white">
                  <Zap size={32} />
                </div>
                <p className="text-gray-600 font-medium">Real-time Polling Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
