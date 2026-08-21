import React from 'react'
import { BarChart3, MessageCircle, Users, Zap, Lock, Clock } from 'lucide-react'

export const Features: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Create in Seconds',
      description: 'Set up a poll in less than a minute. No coding, no complexity — just your question and options.',
      benefit: 'Launch faster than emails or surveys'
    },
    {
      icon: BarChart3,
      title: 'See Results in Real-Time',
      description: 'Watch vote counts update instantly as people respond. No delays, no waiting for data exports.',
      benefit: 'Make decisions based on live feedback'
    },
    {
      icon: Users,
      title: 'Engage Your Community',
      description: 'Boost polls to reach more voters, comment on responses, and build meaningful discussions.',
      benefit: 'Turn responses into conversations'
    },
    {
      icon: MessageCircle,
      title: 'Comment & Discuss',
      description: 'Let voters share thoughts and perspectives. Understand the "why" behind each vote.',
      benefit: 'Deeper insights than numbers alone'
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your data is encrypted and stored securely. Only you and authorized participants can access polls.',
      benefit: 'Full control over who votes'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Polls never close. Keep collecting feedback as long as you need.',
      benefit: 'Continuous feedback loop'
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
            Everything You Need to Gather Feedback
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make polling effortless and insights actionable.
          </p>
        </div>

        {/* Features grid - 2x3 layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-8 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl group-hover:bg-gradient-primary group-hover:text-white transition duration-300 shadow-md">
                  <Icon size={28} className="text-blue-600 group-hover:text-white transition" />
                </div>
                
                <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Benefit highlight */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-primary">
                    💡 {feature.benefit}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA at end of features */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Ready to start gathering feedback?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join teams and communities already using Voxly to make better decisions.
            </p>
            <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105">
              Create Your First Poll
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
