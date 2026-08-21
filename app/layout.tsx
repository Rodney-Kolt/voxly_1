import type { Metadata } from 'next'
import { AuthProvider } from '@/app/context/AuthContext'
import { PollProvider } from '@/app/context/PollContext'
import { Navigation } from '@/app/components/Navigation'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Voxly - Your Voice, Amplified',
  description: 'Create engaging polls, gather feedback in real-time, and make decisions together with your community.',
  keywords: ['polls', 'voting', 'feedback', 'community', 'real-time'],
  openGraph: {
    title: 'Voxly - Your Voice, Amplified',
    description: 'Create engaging polls and gather feedback in real-time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <AuthProvider>
          <PollProvider>
            <Navigation />
            <main>{children}</main>
          </PollProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
