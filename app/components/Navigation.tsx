'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Menu, X, Zap } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log('Signed in as:', result.user.displayName)
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-secondary hover:text-primary transition">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              V
            </div>
            <span>Voxly</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#polls" className="text-gray-700 hover:text-primary transition">
              Polls
            </Link>
            <Link href="/#features" className="text-gray-700 hover:text-primary transition">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-700 hover:text-primary transition">
              How it Works
            </Link>
          </div>

          {/* Right side - Auth & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/create"
                  className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2"
                >
                  <Zap size={18} />
                  Create Poll
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-4 py-4">
              <Link href="/#polls" className="text-gray-700 hover:text-primary transition px-4">
                Polls
              </Link>
              <Link href="/#features" className="text-gray-700 hover:text-primary transition px-4">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-gray-700 hover:text-primary transition px-4">
                How it Works
              </Link>
              <div className="px-4 pt-2 border-t border-gray-200">
                {loading ? (
                  <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
                ) : user ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/create"
                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 justify-center"
                    >
                      <Zap size={18} />
                      Create Poll
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      {user.photoURL && (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
