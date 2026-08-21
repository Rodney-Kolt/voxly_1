'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'

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
          <span className="text-sm font-semibold text-blue-600">✨ Real-time Polling Platform</span>
        </div>

        {/* Main heading - More compelling */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-secondary mb-6 leading-tight">
          Gather Insights in{' '}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Real-Time
          </span>
        </h1>

        {/* Subheading - Clear value prop */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Create instant polls, engage your community, and make data-driven decisions together. No setup required — just sign in, create, and share.
        </p>

        {/* Trust indicators */}
        <div className="mb-12 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-gray-700">100% Free to use</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-gray-700">No credit card needed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-gray-700">Private & Secure</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {loading ? (
            <div className="h-14 w-56 bg-gray-200 rounded-lg animate-pulse" />
          ) : user ? (
            <Link
              href="/profile"
              className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2 justify-center"
            >
              Go to Dashboard
              <ArrowRight size={20} />
            </Link>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-bold text-lg hover:shadow-lg transition transform hover:scale-105 inline-flex items-center gap-2 justify-center"
            >
              Start Creating Polls Free
              <ArrowRight size={20} />
            </button>
          )}
          <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold text-lg hover:border-primary hover:text-primary transition inline-flex items-center gap-2 justify-center">
            See How It Works
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero image with stats */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-3xl blur-3xl" />
          <div className="relative bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-64 sm:h-96 flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full text-white">
                  <Zap size={32} />
                </div>
                <p className="text-gray-700 font-bold text-lg">Real-time Polling</p>
                <p className="text-gray-600 text-sm">See results instantly as people vote</p>
              </div>
              
              {/* Stats row */}
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-secondary">0ms</p>
                  <p className="text-xs text-gray-600">Latency</p>
                </div>
                <div className="w-px bg-gray-300" />
                <div>
                  <p className="text-2xl font-bold text-secondary">∞</p>
                  <p className="text-xs text-gray-600">Voters</p>
                </div>
                <div className="w-px bg-gray-300" />
                <div>
                  <p className="text-2xl font-bold text-secondary">30s</p>
                  <p className="text-xs text-gray-600">Setup Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
