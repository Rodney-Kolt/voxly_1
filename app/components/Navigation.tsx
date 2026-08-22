'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Menu, X, Plus } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      if (!auth) {
        console.error('Firebase not initialized')
        return
      }
      await signInWithPopup(auth, googleProvider)
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-voxly-bg/95 backdrop-blur-sm border-b border-voxly-border z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-serif text-2xl md:text-3xl text-voxly-text hover:text-voxly-accent transition">
            <div className="w-8 h-8 bg-voxly-accent rounded-lg flex items-center justify-center text-voxly-bg text-sm font-bold">
              V
            </div>
            <span className="hidden sm:inline">Voxly</span>
          </Link>

          {/* Desktop Menu - Center (empty for now, tabs will be in PollFeed) */}
          <div className="hidden md:flex items-center gap-8" />

          {/* Right side - Auth & Create */}
          <div className="hidden md:flex items-center gap-6">
            {loading ? (
              <div className="h-10 w-24 bg-voxly-border rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-voxly-accent text-voxly-accent hover:bg-voxly-accent/10 rounded-full font-medium transition-colors duration-200"
                >
                  <Plus size={18} />
                  Create Poll
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-voxly-card transition"
                >
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full border border-voxly-border"
                    />
                  )}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-4 py-2 border border-voxly-accent text-voxly-accent hover:bg-voxly-accent/10 rounded-full font-medium transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-voxly-text hover:text-voxly-accent transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-voxly-border">
            <div className="flex flex-col gap-3 py-4">
              {loading ? (
                <div className="h-10 w-full bg-voxly-border rounded animate-pulse" />
              ) : user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/create"
                    className="px-4 py-2 border border-voxly-accent text-voxly-accent hover:bg-voxly-accent/10 rounded-full font-medium flex items-center gap-2 justify-center transition-colors"
                  >
                    <Plus size={18} />
                    Create Poll
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-voxly-text hover:text-voxly-accent transition text-center"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="px-4 py-2 border border-voxly-accent text-voxly-accent hover:bg-voxly-accent/10 rounded-full font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
