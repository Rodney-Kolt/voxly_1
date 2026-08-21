import { PollFeed } from '@/app/components/PollFeed'

export default function Home() {
  return (
    <main className="min-h-screen bg-voxly-bg">
      {/* Add top padding to account for navbar */}
      <div className="pt-20 md:pt-24">
        <PollFeed />
      </div>
    </main>
  )
}
