import { Hero } from '@/app/components/Hero'
import { Features } from '@/app/components/Features'
import { HowItWorks } from '@/app/components/HowItWorks'
import { PollList } from '@/app/components/PollList'
import { BoostedPolls } from '@/app/components/BoostedPolls'
import { Footer } from '@/app/components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* Boosted Polls Section */}
      <section id="boosted-polls" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <BoostedPolls />
        </div>
      </section>

      {/* Recent Polls Section */}
      <section id="polls" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
              Recent Polls
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vote on active polls, share your opinion, and see what others think.
            </p>
          </div>
          
          <PollList />
        </div>
      </section>

      <Footer />
    </>
  )
}
